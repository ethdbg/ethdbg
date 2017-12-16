const ContractManager = require('./contract_manager');
const Contract = require('./contract');
const Logger = require('./logger');
const GanacheWrapper = require('./ganache_wrapper');
const EventEmitter = require('events');
const {
  isDef,
  waitForEvents,
} = require('./utils');
const {events} = require('./types');
require('./event_manager'); // avoid promise rejections

/**
 * Where the magic is abstracted, and the pain goes away
 * 'this' is returned to allow for chaining of methods
 * @author Sean Batzel
 * @author Andrew Plaza <aplaza@liquidthink.net>
 * @param {Object} options - options
 * @public
 */
class Debugger extends EventEmitter {
  constructor(options) { // eslint-disable-line require-jsdoc
    super();
    // TODO: optionally pull options from options config file
    const logLvl = isDef(options.loggerLevel) ? options.loggerLevel : 1;
    this.logger = new Logger(logLvl);
    this.cManager = new ContractManager(this.logger);
    this.vm = null;
    this.testRPC = null;
    this.rpcOpts = isDef(options.testRPC) ? options.testRPC : {};

    // input events
    this.on(events.addBreakpoints, (breakpoints) => {
      this.addBreakpoints(breakpoints);
    });

    this.on(events.removeBreakpoints, (breakpoints) => {
      this.removeBreakpoints(breakpoints);
    });

    this.on(events.toggleBreakpoint, (breakpoint) => {
      this.toggleBreakpoint(breakpoint);
    });

    this.on(events.start, () => {
      this.events().listen();
    });

    this.on(events.stop, () => {
      this.events().stop();
    });

    this.on(events.kill, () => {
      process.kill(0);
    });
  }

  /**
   * add a contract to debug
   * @param{Object} options -
   * Object with file path, compiled source, or source of contract
   *  path: string - string of filepath of contract
   *  source: string - source code of contract as utf8 string
   * @public
   * @return{Debugger}
   */
  add(options) {
    if (isDef(options.path)) {
      this.cManager.add(options.path);
    } else if (isDef(options.source)) {
      this.cManager.addBySource(options.source);
    } else {
      throw new Error('must specify one of source or path to debugger.add');
    }
    return this;
  }

  /**
   * Deploys all contracts in this.cManager
   * instantiates the debug TestRPC
   * @author Sean Batzel
   * @public
   * @return{Debugger}
   */
  async start() {
    this.testRPC = new GanacheWrapper(this.logger, this.rpcOpts);
    this.vm = await this.testRPC.init();
    this.testRPC.initEvents();
    const contracts = this.cManager.values();

    // deploy contracts in parallel
    await Promise.all(contracts.map(async (c) => {
      await c.deploy();
    }));
    this.emit(events.ready);
    return this;
  }

  /**
   * Toggle a breakpoint on or off
   * @author Sean Batzel
   * @author Andrew Plaza
   * @param {string} name - the name of the contract the breakpoint belongs to
   * @param {number} lineNumber - line number of breakpoint to toggle
   * @public
   * @return{Debugger}
   */
  toggleBreakpoint(name, lineNumber) {
    if (this.cManager.get(name).exists(lineNumber)) {
      this.cManager.get(name).remove(lineNumber);
    } else {
      this.cManager.get(name).add(lineNumber);
    }
    return this;
  }

  /**
   * add breakpoints
   * if file breakpoint belongs to does not exist in manager,
   * it is created
   * @param{Array<Array>} breakpoints - array of breakpoints (num) and the
   * source code it belongs to (string) as
   * `[[1, 'source_file_x.sol'], [32, 'source_file_y.sol']]`
   * @return{Debugger}
   */
  addBreakpoints(breakpoints) {
    breakpoints.forEach((bp) => {
      this.cManager.getBySource(bp[1]).add(bp[0]);
    });
    return this;
  }

  /**
   * remove breakpoints
   * @param{Array<Array>} breakpoints - array of breakpoints and the source
   * code they belong to as:
   * `[[93, 'source_file_a'], [124, 'source_file_w']]`
   * @return{Debugger}
   */
  removeBreakpoints(breakpoints) {
    breakpoints.forEach((bp) => {
      this.cManager.getBySource(bp[1]).remove(bp[0]);
    });
    return this;
  }

  /**
   * Debugger follows execution in function contexts.
   * @author Sean Batzel
   * @author Andrew Plaza
   * @public
   * @return{Debugger}
   */
  stepInto() {
    this.emit(events.stepInto);
    return this;
  }

  /**
   * Step Over operation (does not inspect/go into functions/library funcs)
   * @author Andrew Plaza
   * @public
   * @return{Debugger}
   */
  next() {
    this.emit(events.stepOver);
    return this;
  }

  /**
   * Listens for step events on the EVM
   * if a breakpoint is hit, it calls `hitBreakpoint` instance method
   * @private
   * @author Andrew Plaza
   * @return{Object}
   */
  events() {
    let deploying = false;

    /**
     * run when a breakpoint is hit in the EVM
     * @param {Object} evObj - memory, stack, address, account, etc from EVM
     * @private
     * @return{Debugger}
     */
    const hitBreakpoint = async (evObj) => {
      this.emit(events.VMBreakpoint, evObj);
      let next =
        await waitForEvents(this, [
          events.stepOver, events.stepInto, events.continue,
        ]);
      return this;
    };

    const stepHook = async (eventObj, cb) => {
      this.logger.vmDebug(
        `Executing ${eventObj.opcode.name}. PC: ${eventObj.pc}`);

      const dbgAddr = eventObj.address.toString('hex');
      // we can't get the code of a contract that has not yet been deployed
      // so we only track code if 'deploy' is set
      let c = this.cManager.findByAssocAddr(dbgAddr);
      if (!isDef(c) &&
        !this.cManager.outliers.includes(dbgAddr)
        && !deploying) {
          c = await this.trackCode(dbgAddr);
          if (c) deploying = !deploying;
      }

      if (c instanceof Contract) {
        const srcLoc =
          c.getSourceLocationFromPC(this.cManager.codeManager, eventObj.pc);
        if (isDef(srcLoc)) {
          this.logger.vmDebug(
            `line range: ${srcLoc.start}:${srcLoc.end}`
          );
          this.logger.vmDebug(
            `source:
            ${c.getSource().substr(
              srcLoc.map.start, srcLoc.map.start + srcLoc.map.length)}`);
        }
        if (
          isDef(srcLoc) &&
          c.exists(srcLoc.start)
        ) {
          await hitBreakpoint({breakpoint: srcLoc.start, eventObj});
        }
      }

      this.logger.vmDebug(
        `Executed ${eventObj.opcode.name}. PC: ${eventObj.pc}`);
      cb();
    };

    const afterTx = async (data, cb) => {
      // creation of an address means a contract has been deployed
      if (isDef(data.createdAddress)) deploying = !deploying;
      cb();
    };

    return {
      listen: () => {
        this.vm.on('step', stepHook);
        this.vm.on('afterTx', afterTx);
      },
      close: () => {
        this.removeListener('step', stepHook);
        this.removeListener('afterTx', afterTx);
      },
    };
  }

  /**
   * @author Andrew Plaza
   * adds a contract address and associates it with an
   * instantiated Contract object managed by cManager
   * if we do not manage a contract with the corresponding bytecode at the addr
   * it is added to an array of 'outliers'
   * @param{string} addr - hex string of address for which code we want to track
   * @return{bool|Contract} -
   *  - true if contract is being deployed
   *  - false if contract is deployed but not in the ContractManager,
   *  - Contract if deployed and in Manager
   * @private
   */
  async trackCode(addr) {
    const code = await Contract.getCode(
      addr,
      this.testRPC.getProvider(),
      {loggerLevel: this.logger.level}
    );
    if (code === '0x0') return true;
    const c = this.cManager.findByRuntimeBytecode(code);
    if (isDef(c)) {
      c.associate(addr);
      this.logger.vmDebug('associated!');
      return c;
    } else {
      this.cManager.outliers.push(addr);
      return false;
    }
  }

  /**
   * for testing purposes
   * slows down execution of the EVM to see what's happening in real time
   */
  doSomethingIntensive() {
    for(let i = 0; i < 30000000; i++) {

    }
  }
}

module.exports = Debugger;
exports.Debuggers = Debugger;
