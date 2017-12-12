const ContractManager = require('./contract_manager');
const Contract = require('./contract');
const Logger = require('./logger');
const GanacheWrapper = require('./ganache_wrapper');
const {
  isDef,
  toUTF8
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
    const logLvl = isDef(options.loggerLevel) ? options.loggerLevel : 1;
    this.logger = new Logger(logLvl);
    this.cManager = new ContractManager(this.logger);
    this.vm = null;
    this.testRPC = null;
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
    const logger = new Logger(5);
    this.testRPC = new GanacheWrapper(logger, {fork: false});
    this.vm = await this.testRPC.init();
    this.testRPC.initEvents();
    const contracts = this.cManager.values();

    // deploy contracts in parallel
    await Promise.all(contracts.map(async (c) => {
      await c.deploy();
    }));
    this.stepHook();
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
   * Listens for step events on the EVM
   * @private
   */
  stepHook() {
    this.vm.on('step', async (eventObj, cb) => {
      const dbgAddr = eventObj.address.toString('hex');
      this.logger.vmDebug(dbgAddr);

      if (!isDef(this.cManager.findByAssocAddr(dbgAddr))) {
        const code = await Contract.getCode(
          eventObj.address.toString('hex'),
          this.testRPC.getProvider(),
          {loggerLevel: this.logger.level}
        );
        const c = this.cManager.findByRuntimeBytecode(code);
        if (isDef(c)) {
          c.associate(eventObj.address.toString('hex'));
          this.logger.vmDebug('associated!');
        }
      }
      this.logger.vmDebug(
        `Executed ${eventObj.opcode.name}. PC: ${eventObj.pc}`);
      cb();
    });
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
