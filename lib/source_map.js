const os = require('os');
const HashMap = require('hashmap');
const RemixLib = require('remix-lib');
const SourceMappingDecoder = RemixLib.SourceMappingDecoder;
const {fork} = require('child_process');
const {events} = require('./types');
const {
  isDef,
  waitForEventWithTimeout,
} = require('./utils');
const Contract = require('./contract');

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
    this.decoder = new SourceMappingDecoder();
    this.lineBreakPos = this.decoder.
      getLinebreakPositions(this.getSource());
    this.sourcemaps = this.decoder.decompressAll(this.getRuntimeMap());
    this.sourceMap = this.mapLineNums();
    this.traceManager; this.codeManager;
    this.provider = isDef(options.provider) ?
      options.provider : 'http://localhost:8546';
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
   * @param{index} index - index in the instruction list where
   * src location is retrieved
   * @return{Promise}
   * @public
   */
  getSourceLocationFromInsIndex(index) {
    try {
      return this.decoder.atIndex(index, this.getRuntimeMap());
    } catch (err) {
      throw new Error(`Error in source_map: ${err}`);
    }
  }

  /**
   * Get the source location from the Program Counter of the EVM
   * @param{CodeManager} codeManager - modified RemixIDE codeManager
   * @param{Number} pc - Program Counter EVM is at
   * @return{Object} - end and start line values
   */
  getSourceLocationFromPC(codeManager, pc) {
    let index = codeManager.getInstructionIndex(
      this.getAddress(),
      pc,
      this.getRuntimeBytecode()
    );
    const sourceLoc = this.decoder.atIndex(index, this.getRuntimeMap());
    console.log("Src Location:");
    console.log(sourceLoc);
    let lineCol =
      this.decoder.convertOffsetToLineColumn(sourceLoc, this.lineBreakPos);
    if (isDef(lineCol.start) && isDef(lineCol.end)) {
      return {
        start: lineCol.start.line + 1,
        end: lineCol.end.line + 1,
        map: sourceLoc,
      };
    } else {
      return null;
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
   * A method to visually inspect the source mappings generated from the AST
   * and their corresponding location in the source code
   * useful for debugging the debugger (heh) visually
   * @private
   */
  test() {
    this.sourcemaps.forEach((s) => {
      this.logger.debug(s);
      this.logger.debug(this.getSource().substr(s.start, s.start + s.length));
    });
  }
  /**
   * TODO: possibly get rid of this
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
    for (let i = 0; i < sourcemaps.length; i++) {
      const map = sourcemaps[i];
      if (map.start === -1 || map.length === -1 || map.file === -1) break;
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
