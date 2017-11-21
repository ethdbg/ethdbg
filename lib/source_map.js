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
   * get instruction offset from line/col
   * @author Andrew Plaza
   * @author Sean Batzel
   * @param {number} lineNum - line number of source code to get offset from
   * @return {Object}
   */
  getInstOffset(lineNum) {
    // TODO: Put line/col -> offset mappings in B-Tree
    // Fork process into thread and rejoin when done
    // possibly drop into Rust
    let sourcemaps = this.sourcemaps.reverse();
    let match = {
      startEnd: null,
      map: null,
      offset: null,
    };
    // GG wp SOLITITY
    for (let i = 0; i < sourcemaps.length; i++) {
      const map = sourcemaps[i];
      const startEnd = this.decoder. //returns 0-indexed line nums
        convertOffsetToLineColumn(map, this.lineBreakPos);
      startEnd.end.line += 1;
      startEnd.start.line += 1;

      if ((startEnd.end.line >= lineNum) && (startEnd.start.line <= lineNum)) {
        if (startEnd.end.line - startEnd.start.line === 0) {
          match.startEnd = startEnd;
          match.map = map;
          match.offset = sourcemaps.length - i;
          return match;
        } else if (match.startEnd !== null) { // check for better match
          if ((startEnd.end.line - startEnd.start.line) <
            (match.startEnd.end.line - match.startEnd.start.line)
          ) {
            match.startEnd = startEnd;
            match.map = map;
            match.offset = sourcemaps.length - i;
          }
        } else {
          match.startEnd = startEnd;
          match.map = map;
          match.offset = sourcemaps.length - i;
        }
      }
    }

    this.logger.debug(match);
    return match;
  }
}

module.exports = SourceMap;
