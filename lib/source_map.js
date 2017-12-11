const os = require('os');
const HashMap = require('hashmap');
const {fork} = require('child_process');
const {events} = require('./types');
const {
  chckVar,
  waitForEventWithTimeout,
} = require('./utils');
const Contract = require('./contract');
const SourceMappingDecoder = require('./util/source_map_decoder');

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
    this.provider = chckVar(options.provider) ?
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
   * get the source location in the contract from the program counter
   * TODO: Do this with forked process
   * @param{Int} pc - program counter of the VM
   * @param{string} name - name of in the format of `Contract:MethodName` of
   * contract method to get SrcLocation from. If deploy method, should be
   * `Contract:_init`
   * @param{options|null|undefined} optionally specify transaction Object and/or
   * provider
   * @param{string|null|undefined} provider - provider url of TestRPC instance
   * @return{Promise}
   */
  async getSourceLocationFromPC(pc, options) {
    this.checkContract();
    const provider =
      chckVar(options.provider) ? options.provider : this.provider;
    let tx = chckVar(options.tx) ? options.tx : null;
    const getSrcLoc = fork('./source_map_workers/getSourceLocationFromPC.js');
    this.initHandlers(getSrcLoc);
    tx = await this.getTransaction(provider, tx);
    let hexCode = await this.getHexCode();
    getSrcLoc.send(JSON.stringify({
      provider,
      pc,
      name: this.getRealName(),
      runtimeMap: this.getRuntimeMap(),
      tx,
      hexCode,
      loggerLevel: this.logger.level,
    }));
    let result = await waitForEventWithTimeout(
      getSrcLoc,
      events.message,
      3000,
      `Matching Up The Source Location from Program Counter Timed Out`
    );
    return result;
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
