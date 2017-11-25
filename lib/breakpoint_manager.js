const SourceMap = require('./source_map');
const _ = require('lodash');
const Breakpoint = require('./breakpoint');

/**
 * Manages Breakpoints
 * @author Andrew Plaza <aplaza@liquidthink.net>
 * @param {Contract} contract - Contract that is being debugged
 * @param {Logger} logger - Logger for debug/general output
 * @private
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
   * @private
   */
  add(lineNum) {
    const srcInfo = this.srcMap.get(lineNum);
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
   * @private
   */
  remove(lineNum) {
    _.remove(this.breakpoints, (bp) => {
      bp.lineNum === lineNum;
    });
  }

  /**
   * check if a breakpoint exists by line number
   * @param {number} lineNum - lineNumber of breakpoint to find
   * @return {boolean}
   * @private
   */
  exists(lineNum) {
    if (_.find(this.breakpoints, {
        lineNum,
      }) === 'undefined') {
      return false;
    }
    return true;
  }
}

module.exports = BreakpointManager;
