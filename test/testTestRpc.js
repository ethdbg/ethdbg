import TestRPC from './../lib/test_rpc';
import Logger from './../lib/logger';
import Contract from './../lib/contract';
import {fork} from 'child_process';
import {expect} from 'chai';

let origTestRPC = null;
describe('TestRpc', function() {
  before(function() {
    origTestRPC = fork('./testrpc/cli.js', [], {silent: true});
  });
  after(function() {
    origTestRPC.kill('SIGINT');
  });
  describe('Constructor', function() {
    it('should be created with 5 properties w/o error', function() {
      const logger = new Logger(5);
      const contract = new Contract(
        'http://localhost:8546',
        './test/Simple.sol',
        'SimpleStorage',
        logger,
        {},
      );
      const testRpc = new TestRPC(contract, logger);
      expect(testRpc).to.have.property('contract');
      expect(testRpc).to.have.property('forkedBlockchain');
      expect(testRpc).to.have.property('forkAddress');
      expect(testRpc).to.have.property('logger');
      expect(testRpc).to.have.property('readyEvent');
    });
  });
  describe('InitEvents', function() {
    it('should initialize listeners to forked process w/o error', function() {
      const logger = new Logger(5);
      const contract = new Contract(
        'http://localhost:8546',
        './test/Simple.sol',
        'SimpleStorage',
        logger,
        {},
      );
      const testRpc = new TestRPC(contract, logger);
      testRpc.initEvents();
    });
  });
  /*describe('DeployContract', function() {
    it('should deploy the contract and halt at the first instruction',
    function(done) {
      const logger = new Logger(5);
      const contract = new Contract(
        'http://localhost:8546',
        './test/Simple.sol',
        'SimpleStorage',
        logger,
        {},
      );
      const testRpc = new TestRPC(contract, logger);
      testRpc.initEvents();
      testRpc.runContract(done);
    });
  }); */
});
