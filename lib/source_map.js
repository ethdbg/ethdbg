const os = require('os');
const HashMap = require('hashmap');
const {promisify} = require('util');
const SourceMappingDecoder = require('./utils/source_mapping_decoder');
const CodeManager = require('./remix/codeManager');
const TraceManager = require('./remix/trace/traceManager');
const Contract = require('./contract');
const SourceMapDecoder = require('./util/source_map_decoder');

// TODO: Drop into Rust instead of using Node, it will probably be faster
/**
 * Source Mappings from Bytecode to Source
 * Use Source Decoder to find the
 * @author Andrew Plaza <aplaza@liquidthink.net>
 * @param {Logger} logger - logger class
 * @param {name} string - the name of the contract
 * @param {Object} options - provided to the contract
 *  - compiledContract: the compiled Contract corresponding to the name
 *  in the previous parameters
 *  - path: the path to the source file of the contract
 *  - source: direct source code of the contract as a utf8 string
 *  @extends Contract
 * @private
 */
class SourceMap extends Contract {
  constructor(logger, name, options) {
    super(logger, name, options);
    this.decoder = new SourceMapDecoder();
    this.lineBreakPos = this.decoder.
      getLinebreakPositions(this.getSource());
    this.sourcemaps = this.decoder.decompressAll(this.getRuntimeMap());
    this.sourceMap = this.mapLineNums();
    this.traceManager = new TraceManager();
    this.codeManager = new CodeManager(this.traceManager);
    this.decoder = new SourceMappingDecoder();
  }

  /**
   * map all line numbers in source code to an instruction offset, called on
   * constructor method
   * @return {HashMap}
   * @public
   */
  mapLineNums() {
    let sourceMap = new HashMap();
    const lines = this.getSource().split(os.EOL).length;
    for (let i = 0; i < lines; i++) {
      sourceMap.set(i, this.getInstOffset(i));
    }
    return sourceMap;
  }

  /**
   * Return source location associated with the given index
   * @param{string} addr - address of the contract
   * @param{index} index - index in the instruction list where 
   * src location is retrieved
   * @return{Object}
   * @public
   */
  async getSourceLocationFromInsIndex(addr, index) {
    try {
      return this.decoder.atIndex(index, this.getRuntimeMap());
    } catch (err) {
      throw new Error(`Error in source_map: ${err}`);
    }
  }

  /**
   * get the source location in the contract from the program counter
   * @param{string} addr - contract address from which the source loc
   * is retrieved
   * @param{Int} pc - program counter of the VM
   */
  async getSourceLocationFromPC(addr, pc) {
    const getInstructionIndex = promisify(this.codeManager.getInstructionIndex);
    try {
      const index = await getInstructionIndex(addr, pc);
      return this.sourceMappingDecoder.atIndex(index, this.getRuntimeMap());
    } catch (err) {
      throw new Error(`Error in source_tracker ${err}`);
    }
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
   * @public
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
   * @public
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
    if (match.startEnd !== null) {
      return match;
    }
    return null;
  }
}

module.exports = SourceMap;
