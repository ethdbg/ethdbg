const TestRPC = require('./../lib/test_rpc');
const Logger = require('./../lib/logger');
const Contract = require('./../lib/contract');
const SourceMap = require('./../lib/source_map');
const {
  fork
} = require('child_process');
const {
  expect
} = require('chai');

describe('TestRPC', function() {
  describe('#constructor()', function() {
    it('should contain two attributes', function() {
      let logger = new Logger(1);
      let contract = new Contract('http://localhost:8545',
        './test/Simple.sol',
        'SimpleStorage',
        logger, {});
      let srcmap = new SourceMap(logger, contract);
      let testRPC = new TestRPC(logger, srcmap);
      expect(testRPC).to.have.property('logger');
      expect(testRPC).to.have.property('sourceMap');
    });
    it('should contain two *correct* attributes', function() {
      let logger = new Logger(1);
      let contract = new Contract('http://localhost:8545',
        './test/Simple.sol',
        'SimpleStorage',
        logger, {});
      let srcmap = new SourceMap(logger, contract);
      let testRPC = new TestRPC(logger, srcmap);
      expect(testRPC.logger).to.equal(logger);
      expect(testRPC.sourceMap).to.equal(srcmap);
    });
  });
  describe('#runContract()', function() {
    it('should run without crashing.', function() {
      let logger = new Logger(1);
      let contract = new Contract('http://localhost:8545',
        './test/Simple.sol',
        'SimpleStorage',
        logger, {});
      let srcmap = new SourceMap(logger, contract);
      let testRPC = new TestRPC(logger, srcmap);
      testRPC.runContract(contract, function() {
        logger.debug('caaaaaaaaaaaaallback function.');
      });
    });
  });
});
