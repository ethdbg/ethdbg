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
   */
  constructor() {

  }
}




  // source is a string of solidity code
  /**
   * @author Andrew Plaza
   * @param{String} source
   * @param{Integer} lineNum
   */
function getInstructionofSource(source, lineNum) {
  const decoder = new SourceMapDecoder();
  const linebreaks = decoder.getLineBreakPositions(source);

  let compiledSource = solc.compile(source, 1);
  let sourcemap = compiledSource.contracts["<SOME CONTRACT>"].srcmapRuntime;
  // decompressed sourcemap
  let sourcemaps = decoder.decompressAll(sourcemap);
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
}
