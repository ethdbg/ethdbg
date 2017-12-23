const solc = require('solc');
const fs = require('fs');
const path = require('path');
const XRegExp = require('xregexp');
const _ = require('lodash');

// Global Unhandled Promise Rejection Error Handler, for uncaught errors
process.on('unhandledRejection', (error) => {
  console.log('Unhandled Rejection Error in Eth Debug: ', error.message);
  console.log(error);
});

/**
 * recurses through a directory grabbing all contracts
 * @param{string} sourcePath - unaltered contract file
 * @param{string} contractName - name of contract
 */
class SolidityWrapper {
  constructor(sourcePath, name) { // eslint-disable-line require-jsdoc
    this.cwd = path.dirname(sourcePath);
    this.source = fs.readFileSync(sourcePath, 'utf8');
    this.name = name;
    this.imports = getImports(this.source, this.cwd, sourcePath);

    if (this.imports === 0) {
      this.linkedSource = solc.compile(this.source, 1);
    } else {
      this.imports[sourcePath] = this.source;
      this.linkedSource = solc.compile({ sources: this.imports }, 1);
    }

    /**
     * @param{string} source - source code in utf8 of contract
     * @param{string} current working directory of contract source
     * @param{string} sf - source file path
     */
    function getImports(source, cwd, sf) {
      const rx = /import \\?'([a-zA-Z\_\-\d\/\.sol]+)\\?';/gi; // eslint-disable-line
      if (source.match(rx).length === 0) return 0;

      let sourceObj = {};
      XRegExp.forEach(source, rx, (match, i, str) => {
        const lib = `${cwd}/${match[1]}`;
        if (!fs.existsSync(lib)) {
          throw new Error(
            `file ${lib} required in solidity file '${sf}' does not exist`
          );
        }
        sourceObj[match[1]] = fs.readFileSync(`${cwd}/${match[1]}`, 'utf8');
        if (sourceObj[match[1]].match(rx).length > 0) {
          console.log('in assign');
          const cwd = path.dirname(`${cwd}/${sourceObj[match[1]]}`);
          _.assign(sourceObj, getImports(sourceObj[match[1]], cwd));
        }
      });
      // console.log(sourceObj);
      console.log(Object.keys(sourceObj));
      return sourceObj;
    }
  }

  getSource() {
    return this.linkedSource.contracts[this.name];
  }

  getLinkedSource() {
    return this.linkedSource;
  }
}

module.exports = SolidityWrapper;