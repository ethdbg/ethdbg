const solc = require('solc');

class Repl {

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
  execute(machine, code) {
    //var inter = contract.getSource().split("\n");
    //var full = arr.splice(line + 1, 0, code);
    let mach_code = solc.compile(code);
    let result = machine.runCode({
      code: Buffer.from(mach_code, 'hex'),
      gasLimit: Buffer.from('ffffffff', 'hex')
    }, function (err, results) {
      return results.return.toString('hex');
    });
    return result;
  }
}

module.exports = Repl;