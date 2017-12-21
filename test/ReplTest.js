const REPL = require('./../lib/repl');
const VM = require('ethereumjs-vm');
const { expect } = require('chai');


describe('REPL', function () {
    describe('#execute(machine: ethereumjs-vm, code: string)', function () {
        it('should pass silently', function () {
            let machine = new VM();
            let repl = new REPL();
            let nada = '';
            repl.execute(machine, "x = 1; y = 1s; return x+y;", nada);
        });
        it('should return a valid response from solidity functions', function () {
            let machine = new VM();
            let repl = new REPL();
            let nada = '';
            let result = repl.execute(machine, "x = 1; y = 1; return x+y;", nada);
            expect(result).to.equal(2);
        });
    });
});
