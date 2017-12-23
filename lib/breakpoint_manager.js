const _ = require('lodash');
const SourceMap = require('./source_map');
const Breakpoint = require('./breakpoint');
const { isDef } = require('./utils');

/**
 * Manages Breakpoints
 * @author Andrew Plaza <aplaza@liquidthink.net>
 * @param {Logger} logger - Logger for debug/general output
 * @param {Contract} name - Contract that is being debugged
 * @param {Object} options - Options
 * @private
 */
class BreakpointManager extends SourceMap {
  constructor(logger, name, options) { // eslint-disable-line require-jsdoc
    super(logger, name, options);
    this.breakpoints = [];
  }

  /**
   * Adds a breakpoint based on linenumber
   * @param {number} lineNum - the line number to add to breakpoints
   * @public
   */
  addBreakpoint(lineNum) {
    if (!this.exists(lineNum)) {
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
  }

  /**
   * Removes a breakpoint from the list of breakpoints
   * @param {number} lineNum - breakpoint linenumber to remove
   * @public
   */
  removeBreakpoint(lineNum) {
    _.remove(this.breakpoints, (bp) => {
      bp.lineNum === lineNum;
    });
  }
    
  /**
   * Get rid of all breakpoints
   * @public
   */
  clearBreakpoints() {
    this.breakpoints = [];
  }

  /**
   * check if a breakpoint exists by line number
   * @param {number} lineNum - lineNumber of breakpoint to find
   * @return {boolean}
   * @public
   */
  exists(lineNum) {
    let bp = _.find(this.breakpoints, (b) => {
      return b.lineNum === lineNum;
    });
    if (isDef(bp) && bp.lineNum === lineNum) return true;
  }
}

module.exports = BreakpointManager;
