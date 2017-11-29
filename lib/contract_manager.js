const HashMap = require('hashmap');
const solc = require('solc');
const fs = require('fs');
const _ = require('lodash');
const {chckVar} = require('./utils');
const Contract = require('./contract');

// TODO: Future: accept Globs (directories of contracts, etc)
/**
 * Manages multiple contracts in one sourcecode file
 * keeps a datastructure of all contracts being debugged
 * @author Andrew Plaza <aplaza@liquidthink.net>
 * @param {Logger} logger
 * @param {Object} options - optional build operations
 * available JSON keys:
 *  - contracts: 2d Array to populate initial HashMap with
 *  in the format
 *  [
 *  ['contractSourcePath (string)', ContractObject],
 *  ['contractSourcePath2 (string)', ContractObject2],
 *  ]
 * @private
 */
class ContractManager {
  constructor(logger, options) {
    this.logger = logger;
    if (options.contracts) {
      try {
        this.contracts = new HashMap(options.contracts);
      } catch (err) {
        throw new Error(`Unable to instantiate ContractManager from existing
        list of contracts.`);
      }
    } else {
      this.contracts = new HashMap();
    }
    // map of which contracts are associated with what contract source files
    this.cNameMap = new Map();
  }

  /**
   * get the HashMap of contractNames -> Contracts
   * @return{HashMap} hashmap of contracts
   */
  getContracts() {
    return this.contracts;
  }

  /**
   * normalizes a Contract name if it is prefixed with a ':'
   * @param{string} name - the name to normalize
   * @return {string} name - the contract name w/o any ':' prefixed
   * @public
   */
  normalize(name) {
    if (name.charAt(0) === ':') {
      name = name.substr(1);
      this.normalize(name);
    }
    return name;
  }

  /**
   * adds a contract
   * @param{string} sourceFilePath - sourceFile of contract to add
   * @public
   */
  add(srcFPath) {
    const cmpldSrc = solc.compile(fs.readFileSync(srcFPath, 'utf8'), 1);
    _.forOwn(cmpldSrc.contracts, (val, key) => {
      const c = new Contract(this.logger, key, {compiledContract: val});
      // associate a contract name and sourcePath to entry in HashMap
      this.contracts.set(this.normalize(key), c);
      this.cNameMap.set(this.normalize(key), srcFPath);
    });
  }

  /**
   * adds a contract by Contract object to HashMap
   * @param{Contract} contract - contract to add
   * @public
   */
  addByContract(contract) {
    const name = this.normalize(name);
    if (!chckVar(contract.getPath())) {
      this.contracts.set(name, contract);
      this.cNameMap.set(name, null); // no sourceFilePath
    } else {
      this.contracts.set(name, contract);
      this.cNameMap.set(name, contract.getPath());
    }
  }

  /**
   * get a contract object by it's name
   * @param {string} contractName
   * @return {Contract} the contract with the requested name
   * @public
   */
  get(contractName) {
    if (!this.contracts.has(contractName)) {
      throw new Error('Contract does not exist in HashMap');
    } else return this.contracts.get(contractName);
  }

  /**
   * get an array of contracts that belong to a particular source file
   * @param{string} srcFPath - source file path of contract code
   * @return{Array} array of contracts belonging to sourceFile
   * @public
   */
  getBySource(srcFPath) {
    return this.cNameMap
      .entries()
      .filter((e) => e[1] === srcFPath)
      .map((e) => this.contracts.get(e[0]));
  }

  /**
   * remove a contract from HashMap
   * @param{string} contractName - name of contract to remove
   * @public
   */
  remove(contractName) {
    this.contracts.delete(contractName);
  }

  /**
   * remove a contract from HashMap with it's associated source file
   * @param{string} srcFPath - the path of solidity code to remove associated
   * contracts from
   */
  removeBySource(srcFPath) {
    this.cNameMap
      .entries()
      .filter((e) => e[1] === srcFPath)
      .forEach((e) => this.contracts.delete(e[0]));
  }
}

module.exports = ContractManager;
