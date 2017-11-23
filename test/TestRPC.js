const TestRPC = require('./../lib/test_rpc');
const Logger = require('./../lib/logger');
const Contract = require('./../lib/contract');
const {
  fork
} = require('child_process');
const {
  expect
} = require('chai');

let origTestRPC = null;
describe('TestRpc', function() {
  before(function() {
    const logger = new Logger(5);
    origTestRPC = fork('./testrpc/cli.js', [], {
      silent: true
    });
    const testRPC = new TestRPC(logger);
  });
  after(function() {
    origTestRPC.kill('SIGINT');
  });
  describe('#constructor()', function() {
    it('should be created with 5 properties w/o error', function() {
      const logger = new Logger(5);
      const contract = new Contract(
        'http://localhost:8546',
        './test/Simple.sol',
        'SimpleStorage',
        logger, {},
      );
      //const testRpc = new TestRPC(logger);
      expect(testRpc).to.have.property('forkedBlockchain');
      expect(testRpc).to.have.property('forkAddress');
      expect(testRpc).to.have.property('logger');
      expect(testRpc).to.have.property('readyEvent');
    });
    it('should initialize listeners to forked process w/o error', function() {
      const logger = new Logger(5);
      const contract = new Contract(
        'http://localhost:8546',
        './test/Simple.sol',
        'SimpleStorage',
        logger, {},
      );
      //const testRpc = new TestRPC(contract, logger);
      testRpc.initEvents();
    });
    it('should deploy the contract and halt at the first instruction',
      function(done) {
        const logger = new Logger(5);
        const contract = new Contract(
          'http://localhost:8546',
          './test/Simple.sol',
          'SimpleStorage',
          logger, {},
        );
        //const testRpc = new TestRPC(contract, logger);
        testRpc.initEvents();
        testRpc.runContract(done, () => {
          logger.debug("Contract tested.");
        });
      });
  });
});
