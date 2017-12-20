const Logger = require('./../lib/logger');
const REPL = require('./../lib/repl');
const VM = require('ethereumjs-vm');
const Contract = require('./../lib/contract');
const { expect } = require('chai');


describe('REPL', function () {
    describe('#execute(machine: ethereumjs-vm, code: string)', function () {
        it('should pass silently', function () {
            let logger = new Logger(5);
            let machine = new VM();
            let repl = new REPL();
            repl.execute(machine, "x = 1; y = 1s; return x+y;");
        });
        it('should return a valid response from solidity functions', function () {
            let logger = new Logger(5);
            let machine = new VM();
            let repl = new REPL();
            let result = repl.execute(machine, "x = 1; y = 1; return x+y;");
            expect(result).to.equal(2);
        });
    });
});
