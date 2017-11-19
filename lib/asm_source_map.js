const solc = require('solc');
const logger = require('./logger.js');

/**
 * @author Andrew Plaza <aplaza@liquidthink.net>
 * the mapping from Assembly Solidity to Source Code Solidity
 */
class AsmSourceMap {
  /**
   * @param {string} source - source code in utf8
   * @param {string} contractName - name of contract to debug
   */
  constructor(source, contractName) {
    this.source = source;
    this.contractName = contractName;
    this.compiledSource = solc.compile(source, 1);
    console.log(this.compiledSource);
  }
}

module.exports = AsmSourceMap;
