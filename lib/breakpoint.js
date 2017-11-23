/**
 * breakpoint { line_num: Int, byteRange, number of instruction to get to line}
 * @author Andrew Plaza
 * @private
 * @param {number} lineNumber
 * @param {Object} srcRange - start lin/col to end line/col
 * @param {number} instOffset - instruction offset
 * @param {Object} map - map from SourceMap
 */
class Breakpoint {
  constructor(lineNum, srcRange, instOffset, map) {
    this.lineNum = lineNum;
    this.srcRange = srcRange;
    this.instOffset = instOffset;
    this.map = map;
  }

  /**
   * @author Andrew Plaza
   * @return {Object}
   */
  get() {
    return {
      lineNum: this.lineNum,
      srcRange: this.srcRange,
      instOffset: this.instOffset,
      map: this.map,
    }
  }

  /**
   * Get line number
   * @return {number} lineNum - the line number this breakpoint corresponds to
   */
  getLineNum() {
    return this.lineNum;
  }

  /**
   * Get range of source code for breakpoint/instructions
   * @return {Object} srcRange - the range of source code for this breakpoint
   */
  getSrcRange() {
    return this.srcRange;
  }

  /**
   * Get the instruction offset for this line of code
   * @return {number} instOffset - instruction offset
   */
  getInstOffset() {
    return this.instOffset;
  }

  /**
   * Get the AST mapping for this line of code
   * @return {Object} map - AST decompressed mapping
   */
  getMap() {
    return this.map;
  }
}

module.exports = Breakpoint;

