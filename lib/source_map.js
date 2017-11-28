const SourceMapDecoder = require('./util/source_map_decoder');
const HashMap = require('hashmap');
// const readline = require('readline');
// const fs = require('fs');
const os = require('os');

// TODO: Drop into Rust instead of using Node, it will probably be faster
/**
 * Source Mappings from Bytecode to Source
 * Use Source Decoder to find the
 * @author Andrew Plaza <aplaza@liquidthink.net>
 * @param {Logger} logger - logger class
 * @param {Contract} contract - the contract being debugged
 * @private
 */
class SourceMap {
  /**
 * Source Mappings from Bytecode to Source
 * Use Source Decoder to find the
 * @author Andrew Plaza <aplaza@liquidthink.net>
 * @param {Logger} logger - logger class
 * @param {Contract} contract - the contract being debugged
 * @private
 */
  constructor(logger, contract) {
    this.contract = contract;
    this.logger = logger;
    this.decoder = new SourceMapDecoder();
    this.lineBreakPos = this.decoder.
      getLinebreakPositions(contract.getSource());
    this.sourcemaps = this.decoder.decompressAll(this.contract.getRuntimeMap());
    this.sourceMap = this.mapLineNums();
  }

  /**
   * map all line numbers in source code to an instruction offset, called on
   * constructor method
   * @return {HashMap}
   * @private
   */
  mapLineNums() {
    let sourceMap = new HashMap();
    const lines = this.contract.source.split(os.EOL).length;
    for (let i = 0; i < lines; i++) {
      sourceMap.set(i, this.getInstOffset(i));
    }
    return sourceMap;
  }

  /**
   * Gets a JSON map of key-value pairs of the hashmap
   * @return {Array} - key-val pairs of source-code => bytecode
   * @private
   */
  getJSONMapArray() {
    let res = [];
    this.sourceMap.forEach((val, key) => {
      res[key] = [key, val];
    });
    return res;
  }

  /**
   * Get the match for a line number
   * @param {number} lineNum - line number to get information for
   * @return {Object} - match object containing instruction offset and map
   * information from AST for line number requested
   * @private
   */
  get(lineNum) {
    return this.sourceMap.get(lineNum);
  }

  /**
   * get instruction offset from line/col
   * @author Andrew Plaza
   * @author Sean Batzel
   * @param {number} lineNum - line number of source code to get offset from
   * @return {Object}
   * @private
   */
  getInstOffset(lineNum) {
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
      const startEnd = this.decoder. // returns 0-indexed line nums
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
    if ( match.startEnd !== null) {
      return match;
    }
    return null;
  }
}

module.exports = SourceMap;
