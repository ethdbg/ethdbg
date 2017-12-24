const tmp = require('tmp');
const fs = require('fs');
const path = require('path');
const SolidityParser = require('solidity-parser');
const BreakpointManager = require('./breakpoint_manager');

/**
 * @param{string} sourceFPath - source file path
 */
function getMergedContract(sourceFPath) {
  const imports = SolidityParser.parseFile(sourceFPath, 'imports');
  const tmpC = tmp.fileSync();
  fs.writeSync(tmpC.fd, fs.readFileSync(sourceFPath, 'utf8'));
  const workingDir = path.dirname(sourceFPath);
  imports.forEach((i) => {

  });
}

/**
 * a class to manage what the solc compiler won't
 * Imports, mostly
 * @param {logger} logger
 * @param {string} name
 * @param {object} options
 */
class SolidityCodeManager extends BreakpointManager {
  constructor(logger, name, options) {
    super(logger, name, options);
    this.source = this.getSource();
    this.imports = SolidityParser.parseFile(this.source, "imports");
    this.tmpContract = tmp.fileSync();
    fs.writeSync(this.tmpContract.fd)
  }

  /**
   * return {Object}
   */
  getMerged() {
    return {
      path: this.getPathOfMergedContract,
      fd: this.getFdOfMergedContract,
    }
  }

  getPathOfMergedContract() {

  }

  getFdOfMergedContract() {

  }

  kill() {

  }
}

module.exports = SolidityCodeManager;
