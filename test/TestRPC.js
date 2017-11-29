const TestRPC = require('./../lib/test_rpc');
const Logger = require('./../lib/logger');
const Contract = require('./../lib/contract');
const {expect} = require('chai');


describe('TestRPC', function() {
  describe('#constructor()', function() {
    it('should contain four attributes', function() {
      let logger = new Logger(1);
      let testRPC = new TestRPC(logger);
      expect(testRPC).to.have.property('logger');
      expect(testRPC).to.have.property('server');
      expect(testRPC).to.have.property('hostAddress');
      expect(testRPC).to.have.property('forkAddress');
    });
    it('should contain two *correct* attributes', function() {
      let logger = new Logger(1);
      let testRPC = new TestRPC(logger);
      expect(testRPC.logger).to.equal(logger);
    });
  });
});
