
/**
 * breakpoint { line_num: Int, byteRange, number of instruction to get to line}
 * @author Andrew Plaza
 */
class Breakpoint {
  /**
   * @author Andrew Plaza
   * @param{Integer} lineNumber
   * @param{Integer} byteRange
   * @param{Integer} instNum
   */
  constructor(lineNumber, byteRange, instNum) {
    this.lineNumber = lineNumber;
    this.byteRange = byteRange;
    this.instructionNum = instNum;
  }

  /**
   * @author Andrew Plaza
   * @return {Object}
   */
  get() {
    return {
      lineNum: this.lineNumber,
      byteRange: this.byteRange,
      insNum: this.instructionNum,
    };
  }
}

/**
 * @author Andrew Plaza
 */
class BreakpointManager {
  /**
   * @author Andrew Plaza
   */
  constructor() {
    this.breakpoints = [];
  }
}

module.exports = Breakpoint;
