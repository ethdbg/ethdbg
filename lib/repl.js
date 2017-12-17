const Contract = require('./contract');
const Logger = require('./logger');
const {events} = require('./types');

class Repl {
    // TODO Can we just pass arbitrary code to the ethereum vm?

    constructor() {

    }

    /**
     * Take a string containing solidity code and return results.
     * This should only be called at a breakpoint.
     * @author Sean Batzel
     * @param {GanacheWrapper} machine - The VM process being debugged.
     * @param {string} code - The solidity to be executed.
     * @returns {string} The result of running the code.
     * @public
     */
    execute(machine, code) {
        let result = "";
        let options = {
            'source': code,
        };
        let mach_code = new Contract(machine.logger, "arbitary", options);
        let result = machine.runCode({
            code: Buffer.from(mach_code.getHexCode(), 'hex'),
            gasLimit: Buffer.from('ffffffff', 'hex')
        }, function (err, results) {
            return results;
        });
        return result;
    }
}

module.exports = REPL;