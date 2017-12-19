const Logger = require('./../lib/logger');
const REPL = require('./../lib/repl');
const GanacheWrapper = require('./../lib/ganache_wrapper');
const Contract = require('./../lib/contract');
const { expect } = require('chai');


describe('REPL', function () {
    describe('#execute()', function () {
        it('should pass silently', async function () {
            let logger = new Logger(5);
            let testRPC = new GanacheWrapper(logger);
            let repl = new REPL();
            let contract = new Contract(logger,
                'greeter', { path: './../examples/example_solidity/greeter.sol' });
            await contract.deploy({
                provider: 'http://localhost:8546',
                args: ['hello'],
            });
            repl.execute(testRPC, "x = 1; y = 1s; return x+y;", 33, contract);
        });
        it('should return a valid response from solidity functions', async function () {
            let logger = new Logger(5);
            let testRPC = new GanacheWrapper(logger);
            let repl = new REPL();
            let contract = new Contract(logger,
                'greeter', { path: './../examples/example_solidity/greeter.sol' });
            await contract.deploy({
                provider: 'http://localhost:8546',
                args: ['hello'],
            });
            let result = repl.execute(testRPC, "x = 1; y = 1; return x+y;", 33, contract);
            expect(result).to.equal(2);
        });
    });
});
