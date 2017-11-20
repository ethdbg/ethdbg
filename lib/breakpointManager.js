
/**
 * breakpoint { line_num: Int, byteRange, number of instruction to get to line}
 * @author Andrew Plaza
 * @private
 */
class Breakpoint {
  constructor(lineNumber, byteRange, instNum) {
    this.lineNumber = lineNumber;
    this.byteRange = byteRange;
    this.instructionNum = instNum;
  }

  get() {
    return {
      lineNum: this.lineNumber,
      byteRange: this.byteRange,
      insNum: this.instructionNum,
    }
  }
}
/**
 * Manages Breakpoints
 * @author Andrew Plaza <aplaza@liquidthink.net>
 * @private
 */
class BreakpointManager {
  constructor() {
    this.breakpoints = [];
  }
}
