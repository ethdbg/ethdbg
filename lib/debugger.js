const SourceMap = require('./source_map');
const ContractManager = require('./contract_manager');
const BreakpointManager = require('./breakpoint_manager');
const Logger = require('./logger');
const Contract = require('./contract');
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
  /**
   * Where the magic is abstracted, and the pain goes away
   * @author Sean Batzel
   * @author Andrew Plaza <aplaza@liquidthink.net>
   * @param {Object} options - options
   * @public
   */
   constructor(options) {
    this.logger = new Logger(options.loggerLevel);
    this.cManager = new ContractManager(this.logger);
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
   * Starts stuff.
   * @author Sean Batzel
   * @public
   */
  start() {}

  /**
   * Actually responsible for beginning contract execution.
   * @author Sean Batzel
   * @public
   */
  runContract() {}

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
      this.cManager.get(name).add(lineNumber)
    }
  }

  /**
   * Debugger follows execution in function contexts.
   * @author Sean Batzel
   * @author Andrew Plaza
   * @public
   */
  stepInto() {}

  /**
   * Step Over operation (does not inspect/go into functions/library funcs)
   * @author Andrew Plaza
   * @public
   */
  next() {}
}

module.exports = Debugger;
