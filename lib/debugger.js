const SourceMap = require('./source_map.js');
const Logger = require('./logger');

/**
 * Where the magic is abstracted, and the pain goes away
 * @author Sean Batzel
 * @author Andrew Plaza
 */
class Debugger {
  /**
   * @author Sean Batzel, Andrew Plaza
   * @param{string} sourceCode
   * @param{string} byteCode
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
   * @author Sean Batzel, Andrew Plaza
   * @param{Integer} currentLine
   * @return{bool}
   */
  getBreakpoint(currentLine) {
    // NOTE: We could probably clean this up by condensing it down.
    return (this.source_map
      .line_mapping_set[currentLine]
      .is_breakpoint ? true : false);
  }

  /**
   * @author Sean Batzel, Andrew Plaza
   * @param{Integer} lineNumber
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
   *
   *
   */
  stepOver() {
  
  }

  /**
   *
   *
   */
  next() {
  }
}
