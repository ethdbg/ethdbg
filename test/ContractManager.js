const { expect } = require('chai');
const HashMap = require('hashmap');
const Logger = require('./../lib/logger');
const Contract = require('./../lib/contract');
const ContractManager = require('./../lib/contract_manager');

describe('ContractManager', function () {
  describe('#constructor(logger, options)', function () {
    it('should instantiate class with 3 properties', function () {
      const logger = new Logger(1);
      const cManager = new ContractManager(logger);
      expect(cManager).to.have.property('logger');
      expect(cManager).to.have.property('cHash');
      expect(cManager).to.have.property('cNameMap');
    });
    it('should instantiate a populated HashMap', function () {
      const logger = new Logger(1);
      let mockContract = { p: 1, c: 2, IAmAMock: 3 };
      const cManager = new ContractManager(logger, {
        contracts: [['mockContract', mockContract]],
      });
      expect(cManager.cHash.size).above(0);
    });
  });
  describe('#add(srcFPath: string)', function () {
    it('should add a contract to the HashMap by its source file', function () {
      const logger = new Logger(1);
      const cManager = new ContractManager(logger);
      cManager.add('./test/Simple.sol');
      expect(cManager.has({ name: 'SimpleStorage' })).to.equal(true);
    });
  });
  describe('#addByContract(contract: Contract)', function () {
    it('should add a contract to the HashMap', function () {
      const logger = new Logger(1);
      const contract = new Contract(
        logger,
        'SimpleStorage',
        { path: './test/Simple.sol' }
      );
      const cManager = new ContractManager(logger);
      cManager.addByContract(contract);
      expect(cManager.has({ name: contract.name })).to.equal(true);
    });
  });
  describe('#get(contractName: string)', function () {
    it('should return Object', function () {
      const logger = new Logger(1);
      const cManager = new ContractManager(logger);
      cManager.add('./test/Simple.sol');
      expect(cManager.get('SimpleStorage')).to.be.a('object');
    });
    it('should return the same Contract Object', function () {
      const logger = new Logger(1);
      const cManager = new ContractManager(logger);
      const contract = new Contract(
        logger,
        'SimpleStorage',
        { path: './test/Simple.sol' }
      );
      cManager.addByContract(contract);
      expect(cManager.get(contract.name)).to.eql(contract);
    });
    it('should throw an error if contract does not exist', function () {
      const logger = new Logger(1);
      const cManager = new ContractManager(logger);
      expect(cManager.get.bind(cManager, '🤔 : 🤔 DNE4SURE'))
        .to.throw('Contract does not exist in HashMap');
    });
  });
  describe('#getBySource(srcFPath: string)', function () {
    it('should get contracts that belong to a source file', function () {
      const logger = new Logger(1);
      const cManager = new ContractManager(logger);
      cManager.add('./test/Simple.sol');
      expect(cManager.getBySource('./test/Simple.sol')).to.be.a('array');
    });
  });
  describe('#normalize(contractName: string)', function () {
    it('should normalize a contract name if prepended with :', function () {
      const logger = new Logger(1);
      const cManager = new ContractManager(logger);
      expect(cManager.normalize(':SimpleStorage')).to.equal('SimpleStorage');
    });
    it('should not change a contract name if not prepended with :',
      function () {
        const logger = new Logger(1);
        const cManager = new ContractManager(logger);
        expect(cManager.normalize('SimpleStorage')).to.equal('SimpleStorage');
      });
  });
  describe('#getContracts()', function () {
    it('should return a HashMap of contracts', function () {
      const logger = new Logger(1);
      const cManager = new ContractManager(logger);
      expect(cManager.getContracts()).to.eql(new HashMap());
    });
  });
  describe('#remove(contractName: string)', function () {
    it('should remove a contract from Contract hashmap', function () {
      const logger = new Logger(1);
      const cManager = new ContractManager(logger);
      cManager.add('./test/Simple.sol');
      cManager.remove('SimpleStorage');
      expect(cManager.has({ name: 'SimpleStorage' })).to.equal(false);
    });
  });
  describe('#removeBySource(srcFPath: string)', function () {
    it('should remove all contracts associated with a source file', function () {
      const logger = new Logger(1);
      const cManager = new ContractManager(logger);
      cManager.add('./test/Simple.sol');
      cManager.removeBySource('./test/Simple.sol');
      expect(cManager.has({ name: 'SimpleStorage' })).to.equal(false);
    });
  });
  describe('#has(contractName)', function () {
    it('should return true if contract exists in manager', function () {
      const logger = new Logger(1);
      const cManager = new ContractManager(logger);
      cManager.add('./test/Simple.sol');
      expect(cManager.has({ name: 'SimpleStorage' })).to.equal(true);
    });
    it('should return false if the contract does not exist', function () {
      const logger = new Logger(1);
      const cManager = new ContractManager(logger);
      expect(cManager.has({ name: 'SimpleStorage' })).to.equal(false);
    });
  });
});
