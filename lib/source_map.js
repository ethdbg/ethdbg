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
    this.logger.debug(linebreaks);
    // decompressed sourcemap
    const sourcemaps = decoder.decompressAll(this.contract.getRuntimeMap());
    this.logger.debug(sourcemaps);

    let match = {
      startEnd: null,
      map: null,
    };

    // GG wp SOLITITY
    for (let map in sourcemaps) {
      let startEnd = decoder.convertOffsetToLineColumn(map, linebreaks);
      if ((startEnd.end - startEnd.start) === 0) {
        match.startEnd = startEnd;
        match.map = map;
        break;
      } else if (startEnd.end > lineNum && startEnd.start < lineNum) {
        if (match.startEnd !== null) { // check if better match
          if ((startEnd.end - startEnd.start) < 
            (match.startEnd.end - match.startEnd.start)
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
    return match;
  }
}

module.exports = SourceMap;
