const SourceMap = require('./source_map');
const ContractManager = require('./contract_manager');
const BreakpointManager = require('./breakpoint_manager');
const Logger = require('./logger');
const Contract = require('./contract');
const {chckVar} = require('./utils');

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

    this.test_rpc.readyEvent.on('ready', () => {
      this.contract = new Contract(this.test_rpc.forkAddress,
        options.contractPath,
        options.contractName,
        options.loggerLevel,
        options.contractOptions
      );
      this.srcMap = new SourceMap(
        this.contract,
        this.logger
      );
      this.srcMap.mapLineNums();
      this.breakpointManager = new BreakpointManager(this.contract,
        this.logger);
    });
  }

  /**
   * add a contract to debug
   * @param{Object} options -
   * Object with file path, compiled source, or source of contract
   *  path: string - string of filepath of contract
   *  source: string - source code of contract as utf8 string
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
   */
  start() {
    this.test_rpc.readyEvent.on('ready', () => {});
  }

  /**
   * @author Sean Batzel
   * @public
   */
  runContract() {
    // start execution
    // figure out if starting the testRPC is necessary
    // start testRPC, if needed
    // pass in/run contract through testRPC
    // check if we've hit a breakpoint (breakpoint event)
    // if yes, break
    // if no, keep going, man
  }

  /**
   * Toggle a breakpoint on or off
   * @author Sean Batzel
   * @author Andrew Plaza
   * @param {number} lineNumber - line number of breakpoint to toggle
   * @public
   */
  toggleBreakpoint(lineNumber) {
    this.breakpointManager.exists(lineNumber) ?
      this.breakpointManager.remove(lineNumber) :
      this.breakpointManager.add(lineNumber);
  }

  /**
   * @author Sean Batzel
   * @author Andrew Plaza
   * @public
   */
  stepInto() {
    let line = this.sourceMap.current_line();
    if (this.getBreakpoint(line)) {
      // pause execution
    } else {
      this.sourceMap.next_line();
    }
  }

  /**
   * Step Over operation (does not inspect/go into functions/library funcs)
   * @author Andrew Plaza
   * @public
   */
  next() {}
}

module.exports = Debugger;
