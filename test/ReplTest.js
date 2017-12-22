const REPL = require('./../lib/repl');
const VM = require('ethereumjs-vm');
const { expect } = require('chai');


describe('REPL', function () {
    describe('#execute(machine: ethereumjs-vm, code: string)', function () {
        it('should pass silently', function () {
            let machine = new VM();
            let repl = REPL();
            repl('uint a = 1; uint b = 1; a + b;')
                .then(result => {
                    // if null is returned, it means the last command was not an expression with a return value
                    if (result !== null) {
                        return result.toString();
                    }
                })
                .catch(err => {
                    console.log(err)
                });
        });
        it('should return a valid response from solidity functions', function () {
            let machine = new VM();
            let repl = REPL();
            let res = repl('uint a = 1; uint b = 1; a + b;')
                .then(result => {
                    // if null is returned, it means the last command was not an expression with a return value
                    if (result !== null) {
                        return result.toString();
                    }
                })
                .catch(err => {
                    console.log(err)
                });
            expect(res).to.equal(2);
        });
    });
});
