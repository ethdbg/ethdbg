const SourceMap = require('./source_map.js');
const Logger = require('./logger');

/**
 * Where the magic is abstracted, and the pain goes away
 * @author Sean Batzel
 * @author Andrew Plaza
 * @public
 */
class Debugger {
  /**
   * @author Sean Batzel, Andrew Plaza
   * @param {string} sourceCode
   * @param {string} byteCode
   * @public
   */
  constructor(sourceCode, byteCode) {
    this.breakpoints = [];
    this.source_map = new SourceMap(sourceCode, byteCode);
    this.logger = new Logger(5);
    this.srcMap = new SourceMap();
  }

  /**
   * @author Sean Batzel
   */
   runContract() {
     // start execution
     // figure out if starting the testRPC is necessary
     // start testRPC, if needed
     // pass in/run contract through testRPC
     // check if we've hit a breakpoint
     // if yes, break
     // if no, keep going, man
   }

  /**
   * Check if the current line is a breakpoint
   * @author Sean Batzel, Andrew Plaza
   * @param {number} currentLine
   * @return {bool}
   */
  isBreakpoint(currentLine) {
    // NOTE: We could probably clean this up by condensing it down.
    return (this.source_map
      .line_mapping_set[currentLine]
      .is_breakpoint ? true : false);
  }

  /**
   * Get a list of current breakpoints
   *
   *@return {Array}
   */
  getBreakpoints() {
    return [];
  }

  /**
   * Toggle a breakpoint on or off
   * @author Sean Batzel, Andrew Plaza
   * @param {number} lineNumber
   */
  toggleBreakpoint(lineNumber) {
    this.source_map
      .line_mapping_set[lineNumber]
      .is_breakpoint = !(this.source_map
        .line_mapping_set[lineNumber]
        .is_breakpoint);
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
   *
   */
  next() {
  }
}
