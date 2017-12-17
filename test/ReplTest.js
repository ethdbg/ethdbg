const Logger = require('./../lib/logger');
const REPL = require('./../lib/repl');
const GanacheWrapper = require('./../lib/ganache_wrapper');
const {events} = require('./../lib/types');


describe('REPL', function () {
    describe('#execute()', function () {
        it('should return the correct line number.', function () {
            let logger = new Logger(events.loggerLevels.DEBUG);
            let testRPC = new GanacheWrapper(logger);
            let repl = new REPL("(2**800 + 1) - 2**800");
            expect(repl).to.eql(1);
        });
    });
});
