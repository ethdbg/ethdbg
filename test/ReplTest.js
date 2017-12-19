const Logger = require('./../lib/logger');
const REPL = require('./../lib/repl');
const GanacheWrapper = require('./../lib/ganache_wrapper');
const { expect } = require('chai');


describe('REPL', function () {
    describe('#execute()', function () {
        it('should pass silently', function () {
            let logger = new Logger(5);
            let testRPC = new GanacheWrapper(logger);
            let repl = new REPL();
            let contract = new Contract(logger,
                'greeter', { path: './../examples/example_solidity/greeter.sol' });
            await contract.deploy({
                provider: 'http://localhost:8546',
                args: ['hello'],
            });
            repl.execute(testRPC, "uint x = 1; uint y = 1s; return x+y;", 20, contract);
        });
        it('should return a valid response from solidity functions', function () {
            let logger = new Logger(5);
            let testRPC = new GanacheWrapper(logger);
            let repl = new REPL();
            let contract = new Contract(logger,
                'greeter', { path: './../examples/example_solidity/greeter.sol' });
            await contract.deploy({
                provider: 'http://localhost:8546',
                args: ['hello'],
            });
            let result = repl.execute(testRPC, "uint x = 1; uint y = 1s; return x+y;", 20, contract);
            expect(result).to.equal(2);
        });
    });
});