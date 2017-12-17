const Logger = require('./../lib/logger');
const REPL = require('./../lib/repl');
const GanacheWrapper = require('./../lib/ganache_wrapper');


describe('REPL', function () {
    describe('#execute()', function () {
        it('should return a result of 1.', function () {
            let logger = new Logger(5);
            let testRPC = new GanacheWrapper(logger);
            let repl = new REPL("(2**800 + 1) - 2**800");
            expect(repl).to.eql(1);
        });
    });
});
