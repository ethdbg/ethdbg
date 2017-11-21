
/**
 * breakpoint { line_num: Int, byteRange, number of instruction to get to line}
 * @author Andrew Plaza
 * @private
 * @param {number} lineNumber
 * @param {number} byteRange
 * @param {number} instNum
 */
class Breakpoint {
  constructor(lineNumber: number, byteRange: number, instNum: number) {
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
  constructor() {
    this.breakpoints = [];
  }
}

module.exports = Breakpoint;
