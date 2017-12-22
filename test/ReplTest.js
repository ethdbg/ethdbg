const REPL = require('./../lib/repl');
const { expect } = require('chai');


describe('REPL', function () {
    describe('#execute(machine: ethereumjs-vm, code: string)', function () {
        it('should pass silently', function () {
            let repl = REPL();
            let res = repl('uint a = 1; uint b = 1; a + b;')
                .then(result => {
                    if (result !== null) {
                        return result;
                    }
                })
                .catch(err => {
                    console.log(err)
                });
        });
        it('should return the correct value for 1+1===2', function () {
            let repl = REPL();
            let res = repl('uint a = 1; uint b = 1; a + b;')
                .then(result => {
                    if (result !== null) {
                        expect(result).to.equal(2);
                    }
                })
        });
    });
});
