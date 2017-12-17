const Logger = require('./../lib/logger');
const REPL = require('./../lib/repl');
const GanacheWrapper = require('./../lib/ganache_wrapper');
const {expect} = require('chai');


describe('REPL', function () {
    describe('#execute()', function () {
        it('should return a result of 1.', function () {
            let logger = new Logger(5);
            let testRPC = new GanacheWrapper(logger);
            let repl = new REPL();
            expect(repl.execute(testRPC, "(2**800 + 1) - 2**800")).to.eql(1);
        });
    });
});