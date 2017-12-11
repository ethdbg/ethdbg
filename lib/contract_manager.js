const HashMap = require('hashmap');
const solc = require('solc');
const fs = require('fs');
const wu = require('wu');
const _ = require('lodash');
const {
  chckVar,
} = require('./utils');
const Contract = require('./breakpoint_manager');

// TODO: Future: accept Globs (directories of contracts, etc)
/**
 * Manages multiple contracts and their sourceFiles.
 * Keeps a HashMap of contracts
 * @author Andrew Plaza <aplaza@liquidthink.net>
 * @param {Logger} logger
 * @param {Object} options - optional build operations
 * available JSON keys:
 *  - `contracts`: 2d Array to populate initial HashMap with
 *  - `provider`: URL of web3 provider to deploy and run contracts on
 *  in the format
 *  [
 *  ['contractName (string)', ContractObject],
 *  ['contractName (string)', ContractObject2],
 *  ]
 * @private
 */
class ContractManager {
  /**
   * Manages multiple contracts and their sourceFiles.
   * Keeps a HashMap of contracts
   * @author Andrew Plaza <aplaza@liquidthink.net>
   * @param {Logger} logger
   * @param {Object} options - optional build operations
   * available JSON keys:
   *  - `contracts`: 2d Array to populate initial HashMap with
   *  in the format
   *  [
   *  ['contractName (string)', ContractObject],
   *  ['contractName (string)', ContractObject2],
   *  ]
   * @private
   */
  constructor(logger, options) {
    this.logger = logger;
    // add a typecheck for Contract
    if (chckVar(options) && chckVar(options.contracts)) {
      try {
        this.cHash = new HashMap(options.contracts);
      } catch (err) {
        throw new Error(`Unable to instantiate ContractManager from existing
        list of contracts.`);
      }
    } else {
      this.cHash = new HashMap();
    }
    // map of which contracts are associated with what contract source files
    this.cNameMap = new Map(); // key: contractName, value: srcFPath
    if (chckVar(options) && chckVar(options.provider)) {
      this.provider = options.provider;
    }
  }

  /**
   * get the HashMap of contractNames -> Contracts
   * @return{HashMap} hashmap of contracts
   */
  getContracts() {
    return this.cHash;
  }
  
  /**
   * returns an array of the keys
   * @return{Array}
   */
  entries() {
    return this.cHash.entries();
  }
  /**
   * returns an array of the values of the hashmap
   * @return{Array}
   */
  values() {
    return this.cHash.values();
  }

  /**
   * remove the prefixed ':' from a contract name
   * @param{string} name - the name to normalize
   * @return {string} name - the contract name w/o any ':' prefixed
   * @public
   * @example
   * let contractName = ':SimpleStorage';
   * console.log(this.normalize(contractName)); // SimpleStorage
   */
  normalize(name) {
    if (name.charAt(0) === ':') {
      name = name.substr(1);
      this.normalize(name);
    }
    return name;
  }

  // TODO: make add work with srcFPath or Contract obj
  /**
   * adds a contract by its source file path
   * @param{string} srcFPath - path of the sourceFile to add
   * @public
   */
  add(srcFPath) {
    const source = fs.readFileSync(srcFPath, 'utf8');
    const cmpldSrc = solc.compile(source, 1);
    _.forOwn(cmpldSrc.contracts, (val, key) => {
      const name = this.normalize(key);
      const c = new Contract(this.logger, key, {
        compiledContract: val,
        source,
        provider: this.provider,
      });
      // associate a contract name and sourcePath to entry in HashMap
      this.cHash.set(name, c);
      this.cNameMap.set(name, srcFPath);
    });
  }

  /**
   * adds a contract by Contract object to HashMap
   * @param{Contract} contract - contract to add
   * @public
   */
  addByContract(contract) {
    const name = this.normalize(contract.name);
    if (!chckVar(contract.getPath())) {
      this.cHash.set(name, contract);
      this.cNameMap.set(name, null); // no sourceFilePath
    } else {
      this.cHash.set(name, contract);
      this.cNameMap.set(name, contract.getPath());
    }
  }

  /**
   * adds a contract by it's UTF-8 SourceCode
   * @param{string} source - source code as a utf8 string
   * @param{string} name - name of contract as string
   */
  addBySource(source) {
    const cmpldSrc = solc.compile(source, 1);
    _.forOwn(cmpldSrc.contracts, (val, key) => {
      const name = this.normalize(key);
      const c = new Contract(
        this.logger, 
        key, 
        {
          compiledContract: val,
          provider: this.provider,
        }
      );
      this.cHash.set(name, c);
      this.cNameMap.set(name, null);
    });
  }

  /**
   * get a contract object by it's name
   * @param {string} contractName
   * @return {Contract} the contract with the requested name
   * @public
   */
  get(contractName) {
    const name = this.normalize(contractName);
    if (!this.cHash.has(name)) {
      throw new Error('Contract does not exist in HashMap');
    } else return this.cHash.get(name);
  }

  /**
   * get an array of contracts that belong to a particular source file
   * @param{string} srcFPath - source file path of contract code
   * @return{Array} array of contracts belonging to sourceFile
   * @public
   */
  getBySource(srcFPath) {
    return [...wu(this.cNameMap.entries())
      .filter((e) => e[1] === srcFPath)
      .map((e) => this.cHash.get(e[0])),
    ];
  }

  /**
   * Get the contract which corresponds to a particular deployed address
   * @param{string} addr - address at which contract is deployed
   */
  getByAddress(addr) {
    this.cHash.forEach((contract) => {
      if(contract.getAddress() === addr) {
        return contract;
      }
    });
    throw new Error('No Contract by that address');
  }
  /**
   * remove a contract from HashMap
   * @param{string} contractName - name of contract to remove
   * @public
   */
  remove(contractName) {
    this.cHash.delete(this.normalize(contractName));
  }

  /**
   * remove all contracts associated with a source file
   * @param{string} srcFPath - the path to solidity code that associated
   * contracts will be removed from
   * @public
   */
  removeBySource(srcFPath) {
    wu(this.cNameMap.entries())
      .filter((e) => e[1] === srcFPath)
      .forEach((e) => this.cHash.delete(e[0]));
    wu(this.cNameMap.entries())
      .filter((e) => e[1] === srcFPath)
      .forEach((e) => this.cNameMap.delete(e[0]));
  }

  /**
   * check if the contract exists
   * @param{options} Object specifying what to check existence of contract by
   *  - name: Contract Name
   *  - address: contract address
   * @return{boolean}
   * @public
   */
  has(options) {
    if (options.address) {
      this.cHash.forEach((c) => {
        if (c.getAddress() === options.address) return true;
      });
      return false;
    } else if (options.name) {
      return this.cHash.has(this.normalize(options.name));
    } else {
      throw new Error('must specify one of Name or Address to `has`');
    }
  }
}

module.exports = ContractManager;
