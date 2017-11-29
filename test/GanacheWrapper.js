const GanacheWrapper = require('./../lib/ganache_wrapper');
const Logger = require('./../lib/logger');
const Contract = require('./../lib/contract');
const SourceMap = require('./../lib/source_map');
const {fork} = require('child_process');
const {expect} = require('chai');
const {sleep} = require('./../lib/utils');

// TODO going to have to fork testRPC instance in order to test kill
describe('GanacheWrapper', function() {
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
  describe('#constructor()', function() {
    it('should create a class with three attributes', function() {
      let logger = new Logger(1);
      let contract = new Contract('http://localhost:8545',
        './test/Simple.sol',
        'SimpleStorage',
        logger, {});
      let srcmap = new SourceMap(logger, contract);
      let testRPC = new GanacheWrapper(logger, srcmap);
      expect(testRPC).to.have.property('server');
      expect(testRPC).to.have.property('state');
      expect(testRPC).to.have.property('web3');
    });
    it('should create a child class with four attributes from parent',
      function() {
        let logger = new Logger(1);
        let contract = new Contract('http://localhost:8545',
          './test/Simple.sol',
          'SimpleStorage',
          logger, {});
        let srcmap = new SourceMap(logger, contract);
        let testRPC = new GanacheWrapper(logger, srcmap);
        expect(testRPC).to.have.property('hostAddress');
        expect(testRPC).to.have.property('forkAddress');
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
      let testRPC = new GanacheWrapper(logger, srcmap);
      expect(testRPC.logger).to.equal(logger);
      expect(testRPC.sourceMap).to.equal(srcmap);
    });
  });
  describe('#init()', function() {
    it('should create a server without error', async function() {
      const logger = new Logger(1);
      const contract = new Contract(
        'http://localhost:8546',
        './test/Simple.sol',
        'SimpleStorage',
        logger, {},
      );
      const srcmap = new SourceMap(logger, contract);
      const testRPC = new GanacheWrapper(logger, srcmap, {});
      // await testRPC.init();
    });
  });
  describe('#parseAddress()', function() {
    it('should parse the address with @ correctly', function() {
      const logger = new Logger(1);
      const contract = new Contract(
        'http://localhost:8546',
        './test/Simple.sol',
        'SimpleStorage',
        logger, {},
      );
      const srcmap = new SourceMap(logger, contract);
      const testRPC = new GanacheWrapper(
        logger,
        srcmap,
        {fork: 'http://localhost:0000@123'}
      );
      testRPC.parseAddress();
      expect(testRPC.hostAddress).to.be.a('string');
      // TODO: make testRPC port a number
      expect(testRPC.options.port).to.be.a('string');
    });
    it('should increase the port by 1', function() {
      const logger = new Logger(1);
      const contract = new Contract(
        'http://localhost:8546',
        './test/Simple.sol',
        'SimpleStorage',
        logger, {},
      );
      const srcmap = new SourceMap(logger, contract);
      const testRPC = new GanacheWrapper(
        logger,
        srcmap,
        {fork: 'http://localhost:8545'}
      );
      testRPC.parseAddress();
      expect(parseInt(testRPC.options.port)).to.equal(8546);
    });
    it('should return block number', function() {
      const logger = new Logger(1);
      const contract = new Contract(
        'http://localhost:8546',
        './test/Simple.sol',
        'SimpleStorage',
        logger, {},
      );
      const srcmap = new SourceMap(logger, contract);
      const testRPC = new GanacheWrapper(
        logger,
        srcmap,
        {fork: 'http://localhost:0000@123'}
      );
      const block = testRPC.parseAddress();
      expect(block).to.equal(123);
    });
  });
  describe('#kill()', function() {
    it('should kill the TestRPC instance');
  });
});
