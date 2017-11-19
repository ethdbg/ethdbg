const SourceMapDecoder = require('./util/source_map_decoder');
const solc = require('solc');

/**
 * Source Mappings from Bytecode to Source
 * Use Source Decoder to find the
 */
class SourceMap {
  
  /**
   *constructs source mapping object
   *@author Andrew Plaza <aplaza@liquidthink.net>
   *@param {Contract} contract - the contract being debugged
   */
  constructor(contract) {
    this.contract = contract;
  }

  /**
   * @author Andrew Plaza
   * @author Sean Batzel
   * @param{Int} lineNum - line number of source code to get offset from
   * @return{Object}
   */
  getInstOffset(lineNum) {
    const decoder = new SourceMapDecoder();
    const linebreaks = decoder.getLineBreakPositions(this.contract.source);
    // decompressed sourcemap
    const sourcemaps = decoder.decompressAll(this.contract.getRuntimeMap());

    let match = null;
    // GG wp SOLITITY
    for (let map in sourcemaps) {
      let startEnd = decoder.convertOffsetToLineColumn(map, linebreaks);
      if ((startEnd.end - startEnd.start) === 0) {
        match = startEnd;
        break;
      } else if (startEnd.end > lineNum && startEnd.start < lineNum) {
        if (match !== null) { // check if better match
          if ((startEnd.end - startEnd.start) < (match.end - match.start)) {
            match = startEnd;
          }
        }
      }
    }
    return match;
  }
}
