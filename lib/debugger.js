const SourceMap = require('./source_map');
const BreakpointManager = require('./breakpoint_manager');
const Logger = require('./logger');
const Contract = require('./contract');
const TestRPC = require('./test_rpc');

/**
 * Where the magic is abstracted, and the pain goes away
 * @author Sean Batzel
 * @author Andrew Plaza <aplaza@liquidthink.net>
 * @param {string} sourceCode - solidity Source Code in utf8
 * @param {Contract} contract - Contract Object
 * @public
 */
class Debugger {
  /**
   * Where the magic begins happening.
   * @author Andrew Plaza
   * @param{Object} options
   */
  constructor(options) {
    this.logger = new Logger(options.loggerLevel);
    this.test_rpc = new TestRPC(this.logger);

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
   * Starts stuff.
   */
  start() {
    this.test_rpc.readyEvent.on('ready', () => {
    });
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
  next() {
  }
}

module.exports = Debugger;
