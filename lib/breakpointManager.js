const SourceMap = require('./source_map');
const _ = require('lodash');

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

  getLineNum() {
    return this.lineNum;
  }

  getSrcRange() {
    return this.srcRange;
  }

  getInstOffset() {
    return this.instOffset;
  }

  getMap() {
    return this.map;
  }
}

/**
 * Manages Breakpoints
 * @author Andrew Plaza <aplaza@liquidthink.net>
 * @private
 * @param {Contract} contract - Contract that is being debugged
 * @param {Logger} logger - Logger for debug/general output
 */
class BreakpointManager {
  constructor(contract, logger) {
    this.breakpoints = [];
    this.logger = logger;
    this.srcMap = new SourceMap(contract, logger);
  }

  /**
   * Adds a breakpoint based on linenumber
   * @param {number} lineNum - the line number to add to breakpoints
   */
  add(lineNum) {
    const srcInfo = this.srcMap.getInstOffset(lineNum);
    this.breakpoints.push(
      new Breakpoint(
        lineNum,
        srcInfo.startEnd,
        srcInfo.offset,
        srcInfo.map
      )
    );
  }

  /**
   * Removes a breakpoint from the list of breakpoints
   * @param {number} lineNum - breakpoint linenumber to remove
   */
  remove(lineNum) {
    _.remove(this.breakpoints, (bp) => {
      bp.lineNum === lineNum;
    });
  }
}

module.exports = Breakpoint;
