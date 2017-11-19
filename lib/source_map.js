const SourceMapDecoder = require('./util/source_map_decoder');

/**
 * Source Mappings from Bytecode to Source
 * Use Source Decoder to find the
 */
class SourceMap {
  /**
   *constructs source mapping object
   *@author Andrew Plaza <aplaza@liquidthink.net>
   *@param {Contract} contract - the contract being debugged
   *@param {Logger} logger - logger class
   */
  constructor(contract, logger) {
    this.contract = contract;
    this.logger = logger;
  }

  /**
   * @author Andrew Plaza
   * @author Sean Batzel
   * @param{Int} lineNum - line number of source code to get offset from
   * @return{Object}
   */
  getInstOffset(lineNum) {
    const decoder = new SourceMapDecoder();

    const linebreaks = decoder.getLinebreakPositions(this.contract.getSource());
    // decompressed sourcemap
    const sourcemaps = decoder.decompressAll(this.contract.getRuntimeMap());

    let match = {
      startEnd: null,
      map: null,
    };
    // GG wp SOLITITY
    for(let i = 0; i < sourcemaps.length; i++) {
      const map = sourcemaps[i];
      const startEnd = decoder.convertOffsetToLineColumn(map, linebreaks);
      this.logger.debug(startEnd);
      if ((startEnd.end.line - startEnd.start.line) === 0) {
        match.startEnd = startEnd;
        match.map = map;
        break;
      } else if (startEnd.end.line > lineNum && startEnd.start.line < lineNum) {
        if (match.startEnd !== null) { // check if better match
          if ((startEnd.end.line - startEnd.start.line) <
            (match.startEnd.end.line - match.startEnd.start.line)
          ) {
            match.startEnd = startEnd;
            match.map = map;
          }
        } else {
          match.startEnd = startEnd;
          match.map = map;
        }
      }
    }
    this.logger.debug(match);
    match.startEnd.start.line += 1;
    match.startEnd.end.line += 1;
    return match;
  }
}

module.exports = SourceMap;
