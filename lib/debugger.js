const ContractManager = require('./contract_manager');
const Contract = require('./contract');
const Logger = require('./logger');
const GanacheWrapper = require('./ganache_wrapper');
const {
  isDef,
  waitForEvents,
} = require('./utils');
const {events} = require('./types');
const EventManager = require('./event_manager');

/**
 * Where the magic is abstracted, and the pain goes away
 * 'this' is returned to allow for chaining of methods
 * @author Sean Batzel
 * @author Andrew Plaza <aplaza@liquidthink.net>
 * @param {Object} options - options
 * @param {vm} the EVM being debugged
 * @public
 */
class Debugger {
  constructor(options) {
    // TODO: optionally pull options from options config file
    const logLvl = isDef(options.loggerLevel) ? options.loggerLevel : 1;
    this.logger = new Logger(logLvl);
    this.cManager = new ContractManager(this.logger);
    this.vm = null;
    this.testRPC = null;
    this.rpcOpts = isDef(options.testRPC) ? options.testRPC : {};
  }

  /**
   * Sets context information, including source line, current variables,
   * call stack, any exception information, all that crazy stuff.
   * @return{Object}
   * @author Sean Batzel
   * @public
   */
  getContext() {
    EventManager.on(events.context, (context) => {
      this.context = context;
    });
    return this.context;
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
    // this.events(); // ste off debugger events
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
    EventManager.emit(events.ganacheWrapperBreakpoint);
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
    EventManager.emit(events.stepInto);
    return this;
  }

  /**
   * Step Over operation (does not inspect/go into functions/library funcs)
   * @author Andrew Plaza
   * @public
   * @return{Debugger}
   */
  next() {
    EventManager.emit(events.stepOver);
    return this;
  }

  /**
   * run when a breakpoint is hit in the EVM
   * @param {Object} evObj - memory, stack, address, account, etc from EVM
   * @private
   */
  async hitBreakpoint(evObj) {
    EventManager.emit(events.VMBreakpoint, evObj);
    let next =
      await waitForEvents(EventManager, [
        events.stepOver, events.stepInto, events.continue,
      ]);
  }

  /**
   * Listens for step events on the EVM
   * if a breakpoint is hit, it calls `hitBreakpoint` instance method
   * @private
   * @author Andrew Plaza
   */
  events() {
    let deploying = false;

    this.vm.on('step', async (eventObj, cb) => {
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
          await this.hitBreakpoint(eventObj);
        }
      }

      this.logger.vmDebug(
        `Executed ${eventObj.opcode.name}. PC: ${eventObj.pc}`);
      cb();
    });

    this.vm.on('afterTx', (data, cb) => {
      // creation of an address means a contract has been deployed
      if (isDef(data.createdAddress)) deploying = !deploying;
      cb();
    });
  }

  /**
   * @author Andrew Plaza
   * adds a contract address and associates it with an
   * instantiated Contract object managed by cManager
   * if we do not manage a contract with the corresponding bytecode at the addr
   * it is added to an array of 'outliers'
   * @param{string} addr - hex string of address for which code we want to track
   * @return{bool|Contract|undefined|null} -
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
