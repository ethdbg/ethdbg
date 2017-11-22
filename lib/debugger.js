const SourceMap = require('./source_map');
const BreakpointManager = require('./breakpoint_manager');
const Logger = require('./logger');

/**
 * Where the magic is abstracted, and the pain goes away
 * @author Sean Batzel
 * @author Andrew Plaza <aplaza@liquidthink.net>
 * @public
 * @param {string} sourceCode - solidity Source Code in utf8
 * @param {Contract} contract - Contract Object
 */
class Debugger {
  constructor(contract, logger) {
    this.contract = contract;
    this.logger = logger;
    this.srcMap = new SourceMap(
      contract.getSource(),
      contract.getBytecode()
    );
    this.breakpointManager = new BreakpointManager(contract, logger);
  }

  /**
   * @author Sean Batzel
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
   * @param {number} lineNum - line number of breakpoint to toggle
   */
  toggleBreakpoint(lineNumber) {
    this.breakpointManager.exists(lineNumber) ? 
      this.breakpointManager.remove(lineNumber) :
      this.breakpointManager.add(lineNumber);
  }

  /**
   * @author Sean Batzel
   * @author Andrew Plaza
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
   *Step Over operation (does not inspect/go into functions/library funcs)
   *@author Andrew Plaza
   */
  next() {
  }
}

module.exports = Debugger;
