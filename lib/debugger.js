const ContractManager = require('./contract_manager');
const Logger = require('./logger');
const GanacheWrapper = require('./ganache_wrapper');
const {chckVar} = require('./utils');
const {events} = require('./types');
const EventManager = require('./event_manager');

/**
 * Where the magic is abstracted, and the pain goes away
 * 'this' is returned to allow for chaining of methods
 * @author Sean Batzel
 * @author Andrew Plaza <aplaza@liquidthink.net>
 * @param {Object} options - options
 * @public
 */
class Debugger {
  constructor(options) {
    const logLvl = chckVar(options.loggerLevel) ? options.loggerLevel : 1;
    this.logger = new Logger(logLvl);
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
   * @return{Debugger}
   */
  add(options) {
    if (chckVar(options.path)) {
      this.cManager.add(options.path);
    } else if (chckVar(options.source)) {
      this.cManager.addBySource(options.source);
    } else {
      throw new Error('must specify one of source or path to debugger.add');
    }
    return this;
  }

  /**
   * Deploys all contracts in this.cManager
   * @author Sean Batzel
   * @public
   * @return{Debugger}
   */
  async start() {
    const logger = new Logger(5);
    const testRpc = new GanacheWrapper(logger, {fork: false});
    await testRpc.init();
    testRpc.initEvents();
    const contracts = this.cManager.values();

    // deploy contracts in parallel
    await Promise.all(contracts.map(async (c) => {
      await c.deploy();
    }))
    EventManager.emit(events.debugStart, this, {loggerLevel: this.logger.level});
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
}

module.exports = Debugger;
