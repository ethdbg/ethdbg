const GanacheWrapper = require('./../lib/ganache_wrapper');
const Logger = require('./../lib/logger');
const { expect } = require('chai');

// TODO going to have to fork testRPC instance in order to test kill
describe('GanacheWrapper', function () {
  /* TODO: Design mock web3 API
  let cli;
  before(async function() {
    this.timeout(4000);
    cli = fork('./../testrpc/cli.js', [], {silent: true});
    await sleep(2000); // wait for cli to be ready
  });
  after(function() {
    cli.kill();
  });
  */
  // TODO: write test for options
  describe('#constructor()', function () {
    it('should create a class with three attributes', function () {
      let logger = new Logger(1);
      let testRPC = new GanacheWrapper(logger);
      expect(testRPC).to.have.property('state');
      expect(testRPC).to.have.property('web3');
      expect(testRPC).to.have.property('options');
    });
    it('should create a child class with four attributes from parent',
      function () {
        let logger = new Logger(1);
        let testRPC = new GanacheWrapper(logger);
        expect(testRPC).to.have.property('hostAddress');
        expect(testRPC).to.have.property('forkAddress');
        expect(testRPC).to.have.property('logger');
        expect(testRPC).to.have.property('server');
      });
    it('should contain one *correct* attribute', function () {
      let logger = new Logger(1);
      let testRPC = new GanacheWrapper(logger);
      expect(testRPC.logger).to.eql(logger);
    });
  });
  describe('#init()', function () {
    it('should create a server without error');
  });
  describe('#parseAddress()', function () {
    it('should parse address correctly into two strings', function () {
      const logger = new Logger(1);
      const testRPC = new GanacheWrapper(
        logger,
        { fork: 'http://localhost:0000@123' }
      );
      testRPC.parseAddress();
      expect(testRPC.hostAddress).to.be.a('string');
      // TODO: make testRPC port a number
      expect(testRPC.options.port).to.be.a('string');
    });
    it('should increase the port by 1', function () {
      const logger = new Logger(1);
      const testRPC = new GanacheWrapper(
        logger,
        { fork: 'http://localhost:8545' }
      );
      testRPC.parseAddress();
      expect(parseInt(testRPC.options.port)).to.equal(8546);
    });
    it('should return block number', function () {
      const logger = new Logger(1);
      const testRPC = new GanacheWrapper(
        logger,
        { fork: 'http://localhost:0000@123' }
      );
      const block = testRPC.parseAddress();
      expect(block).to.equal(123);
    });
  });
  describe('#kill()', function () {
    it('should kill the TestRPC instance');
  });
});
