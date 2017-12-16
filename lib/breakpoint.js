/**
 * breakpoint { line_num: Int, byteRange, number of instruction to get to line}
 * @author Andrew Plaza
 * @private
 * @param {number} lineNum
 * @param {Object} srcRange - start lin/col to end line/col
 * @param {number} instOffset - instruction offset
 * @param {Object} map - map from SourceMap
 * @private
 */
class Breakpoint {
  // eslint-disable-next-line require-jsdoc
  constructor(lineNum, srcRange, instOffset, map) {
    this.lineNum = lineNum;
    this.srcRange = srcRange;
    this.instOffset = instOffset;
    this.map = map;
  }

  /**
   * @return {Object}
   * @private
   */
  get() {
    return {
      lineNum: this.lineNum,
      srcRange: this.srcRange,
      instOffset: this.instOffset,
      map: this.map,
    };
  }

  /**
   * Get line number
   * @return {number} lineNum - the line number this breakpoint corresponds to
   * @private
   */
  getLineNum() {
    return this.lineNum;
  }

  /**
   * Get range of source code for breakpoint/instructions
   * @return {Object} srcRange - the range of source code for this breakpoint
   * @private
   */
  getSrcRange() {
    return this.srcRange;
  }

  /**
   * Get the instruction offset for this line of code
   * @return {number} instOffset - instruction offset
   * @private
   */
  getInstOffset() {
    return this.instOffset;
  }

  /**
   * Get the AST mapping for this line of code
   * @return {Object} map - AST decompressed mapping
   * @private
   */
  getMap() {
    return this.map;
  }
}

module.exports = Breakpoint;
