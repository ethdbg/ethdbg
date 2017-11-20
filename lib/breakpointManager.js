
/**
 * breakpoint { line_num: Int, byteRange, number of instruction to get to line}
 * @author Andrew Plaza
 * @private
 */
class Breakpoint {
  /**
   * breakpoint { line_num: Int, byteRange, number of instruction to get to line}
   * @author Andrew Plaza
   * @param {number} lineNumber
   * @param {number} byteRange
   * @param {number} instNum
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
    }
  }
}

/**
 * Manages Breakpoints
 * @author Andrew Plaza <aplaza@liquidthink.net>
 * @private
 */
class BreakpointManager {
  /**
   * @author Andrew Plaza
   * @private
   */
  constructor() {
    this.breakpoints = [];
  }
}

module.exports = Breakpoint;
