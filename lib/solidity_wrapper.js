const solc = require('solc');
const fs = require('fs');
const path = require('path');

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
    this.source = fs.readFileSync(sourcePath, 'utf8');
    this.cwd = path.dirname(sourcePath);
    this.linkedSource = solc.compile(this.source, 1, resolveImports.bind(this));

    function resolveImports(path) {
      if (!fs.existsSync(`${this.cwd}/${path}`)) {
        return {error: 'File not found'};
      } else {
        return { contents: fs.readFileSync(`${this.cwd}/${path}`, 'utf8') };
      }
    }
  }
}

module.exports = SolidityWrapper;

