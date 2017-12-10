const ContractManager = require('./contract_manager');
const Logger = require('./logger');
const GanacheWrapper = require('./ganache_wrapper');
const {
  chckVar,
  events,
} = require('./utils');
const EventManager = require('./event_manager').ethdbgEv;

/**
 * Where the magic is abstracted, and the pain goes away
 * @author Sean Batzel
 * @author Andrew Plaza <aplaza@liquidthink.net>
 * @param {Object} options - options
 * @public
 */
class Debugger {
   constructor(options) {
    this.logger = new Logger(options.loggerLevel);
    this.cManager = new ContractManager(this.logger);
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
    return context;
  }

  /**
   * add a contract to debug
   * @param{Object} options -
   * Object with file path, compiled source, or source of contract
   *  path: string - string of filepath of contract
   *  source: string - source code of contract as utf8 string
   * @public
   */
  add(options) {
    if (chckVar(options.path)) {
      this.cManager.add(options.path);
    } else if (chckVar(options.source)) {
      this.cManager.addBySource(options.source);
    } else {
      throw new Error('must specify one of source or path to debugger.add');
    }
  }

  /**
   * Deploys all contracts in this.cManager
   * @author Sean Batzel
   * @public
   */
  async start() {
    const logger = new Logger(5);
    const testRpc = new GanacheWrapper(logger, {});
    await testRpc.init();
    testRpc.initEvents();
    let map = this.cManager.getContracts();
    for (let i in map) {
      await i.deploy();
    }
  }

  /**
   * Toggle a breakpoint on or off
   * @author Sean Batzel
   * @author Andrew Plaza
   * @param {string} name - the name of the contract the breakpoint belongs to
   * @param {number} lineNumber - line number of breakpoint to toggle
   * @public
   */
  toggleBreakpoint(name, lineNumber) {
    if (this.cManager.get(name).exists(lineNumber)) {
      this.cManager.get(name).remove(lineNumber);
    } else {
      this.cManager.get(name).add(lineNumber);
    }
    EventManager.emit(events.ganacheWrapperBreakpoint);
  }

  /**
   * Debugger follows execution in function contexts.
   * @author Sean Batzel
   * @author Andrew Plaza
   * @public
   */
  stepInto() {
    EventManager.emit(events.stepInto);
  }

  /**
   * Step Over operation (does not inspect/go into functions/library funcs)
   * @author Andrew Plaza
   * @public
   */
  next() {
    EventManager.emit(events.stepOver);
  }
  
  /*
   * Check if line stopped at is a breakpoint
   */
  isBreakpoint(eventObj) {

  }

  events() {
    EventManager.on(events.VMStep, (evObj) => {
      const contract = this.cManager.getByAddress(evObj.address);
      console.log('Got here!');
      console.log(contract);
      EventManager.emit(events.debugContinueExec);
    });
  }
}

module.exports = Debugger;
