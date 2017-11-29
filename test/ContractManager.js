const {expect} = require('chai');
const Logger = require('./../lib/logger');
const 
describe('ContractManager', function() {
  describe('#constructor()', function() {
    it('should instantiate a HashMap to hold contracts')'
    it('should instantiate a populated HashMap if contracts are passed in opts');
  });
  describe('#add(srcFPath: string)', function() {
    it('should add a contract to the HashMap');
  });
  describe('#addByContract(contract: Contract)', function() {
    it('should add a contract to the HashMap');
  });
  describe('#get(contractName: string)', function() {
    it('should return Contract object')
  });
  describe('#getBySource(srcFPath: string)', function() {
    it('should get contracts that belong to a source file');
  });
  describe('#normalize(contractName: string)', function() {
    it('should normalize a contract name if it is prepended with :');
  });
  describe('#getContracts()', function() {
    it('should return a HashMap of contracts');
  });
  describe('#remove(contractName: string)', function() {
    it('should remove a contract from Contract hashmap');
  });
  describe('#removeBySource(srcFPath: string)', function() {
    it('should remove all contracts associated with a source file');
  });
});
