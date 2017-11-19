/**
 *@author Andrew Plaza <aplaza@liquidthink.net>
 */
const solc = require('solc');

/**
 * the mapping from Assembly Solidity to Source Code Solidity
 */
class AsmSourceMap {
  /**
   * @param {string} source - source code in utf8
   * @param {string} contractName - name of contract to debug
   * @param {Logger} logger - Logger class instantiated in root
   */
  constructor(source, contractName, logger) {
    this.source = source;
    this.contractName = contractName;
    this.logger = logger;
    this.compiledSource = solc.compile(source, 1);
    this.logger.debug(this.compiledSource);
  }

  /**
   * @param {number} line - line number to get source mapping of
   */
  get(line) {

  }

  /**
   * get the byte range of a line number
   * @param {number} line - line # to get source mapping of
   */
  byteRange(line) {
  }
}

module.exports = AsmSourceMap;
