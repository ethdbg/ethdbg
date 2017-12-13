const SourceMap = require('./source_map');
const _ = require('lodash');
const Breakpoint = require('./breakpoint');

/**
 * Manages Breakpoints
 * @author Andrew Plaza <aplaza@liquidthink.net>
 * @param {Logger} logger - Logger for debug/general output
 * @param {Contract} name - Contract that is being debugged
 * @param {Object} options - Options
 * @private
 */
class BreakpointManager extends SourceMap {
  /**
   * Manages Breakpoints
   * @author Andrew Plaza <aplaza@liquidthink.net>
   * @param {Logger} logger - Logger for debug/general output
   * @param {Contract} name - Contract that is being debugged
   * @param {Object} options - Options
   * @private
   */
  constructor(logger, name, options) {
    super(logger, name, options);
    this.breakpoints = [];
  }

  /**
   * Adds a breakpoint based on linenumber
   * @param {number} lineNum - the line number to add to breakpoints
   * @public
   */
  add(lineNum) {
    const srcInfo = this.get(lineNum);
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
   * @public
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
   * @public
   */
  exists(lineNum) {
    if (_.find(this.breakpoints, {lineNum}) === 'undefined') {
      return false;
    }
    return true;
  }
}

module.exports = BreakpointManager;
