const SourceMapDecoder = require('./util/source_map_decoder');

/**
 * Source Mappings from Bytecode to Source
 * Use Source Decoder to find the
 * @author Andrew Plaza <aplaza@liquidthink.net>
 * @param {Contract} contract - the contract being debugged
 * @param {Logger} logger - logger class
 */
class SourceMap {
  constructor(contract, logger) {
    this.contract = contract;
    this.logger = logger;
    this.decoder = new SourceMapDecoder();
    this.lineBreakPos = this.decoder.
      getLinebreakPositions(this.contract.getSource());
    this.sourcemaps = this.decoder.decompressAll(this.contract.getRuntimeMap());
  }

  /**
   * @author Andrew Plaza
   * @author Sean Batzel
   * @param {number} lineNum - line number of source code to get offset from
   * @return {Object}
   */
  getInstOffset(lineNum) {
    let match = {
      startEnd: null,
      map: null,
      offset: null,
    };
    // GG wp SOLITITY
    for (let i = 0; i < this.sourcemaps.length; i++) {
      const map = this.sourcemaps[i];
      const startEnd = this.decoder.
        convertOffsetToLineColumn(map, this.lineBreakPos);

      if ((startEnd.end.line - startEnd.start.line) === 0) {
        match.startEnd = startEnd;
        match.map = map;
        match.offset = i;
        break;
      } else if (startEnd.end.line > lineNum && startEnd.start.line < lineNum) {
        if (match.startEnd !== null) { // check if better match
          if ((startEnd.end.line - startEnd.start.line) <
            (match.startEnd.end.line - match.startEnd.start.line)
          ) {
            match.startEnd = startEnd;
            match.map = map;
            match.offset = i;
          }
        } else {
          match.startEnd = startEnd;
          match.map = map;
          match.offset = i;
        }
      }
    }

    match.startEnd.start.line += 1;
    match.startEnd.end.line += 1;
    return match;
  }
}

module.exports = SourceMap;
