const solc = require('solc');

class Repl {

  /**
   * REPL class for arbitrary code execution.
   * @author Sean Batzel
   */
  constructor() {
    this.result = '';
  }

  /**
   * Take a string containing solidity code and return results.
   * This should only be called at a breakpoint.
   * @author Sean Batzel
   * @param {ethereumjs-vm} machine - The VM process being debugged.
   * @param {string} code - The solidity to be executed.
   * @param {string} result - A string to assign the result to.
   * @returns {string} The result of running the code.
   * @public
   */
  execute(machine, code, result) {
    let mach_code = solc.compile(code);
    this.result = result;
    for (var contractName in mach_code.contracts) {
      machine.runCode({
        code: Buffer.from(mach_code
          .contracts[contractName]
          .bytecode, 'hex'),
        gasLimit: Buffer.from('ffffffff', 'hex')
      }, (err, results) => {
        this.result = results.return.toString('hex');
      });
      return this.result;
    }
  }
}

module.exports = Repl;