const solc = require('solc');

var result;

function hack(x) {
  result = x;
}

class Repl {

  /**
   * REPL class for arbitrary code execution.
   * @author Sean Batzel
   */
  constructor() { }

  /**
   * Take a string containing solidity code and return results.
   * This should only be called at a breakpoint.
   * @author Sean Batzel
   * @param {ethereumjs-vm} machine - The VM process being debugged.
   * @param {string} code - The solidity to be executed.
   * @returns {string} The result of running the code.
   * @public
   */
  execute(machine, code, cb = hack) {
    let mach_code = solc.compile(code);
    for (var contractName in mach_code.contracts) {
      machine.runCode({
        code: Buffer.from(mach_code
          .contracts[contractName]
          .bytecode, 'hex'),
        gasLimit: Buffer.from('ffffffff', 'hex')
      }, (err, results, cb) => {
        cb((results.return.toString('hex')));
      });
      return result;
    }
  }
}

module.exports = Repl;