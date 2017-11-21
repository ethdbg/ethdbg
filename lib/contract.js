const Web3 = require('web3');
const fs = require('fs');
const solc = require('solc');
const Logger = require('./logger');

/**
 * Manages deploying and testing smart contracts to the testRPC
 * Manages contracts with web3
 * uses web3 version 0.20.0 API large changes to web3 API in v1.0.0betaX api
 * @author Andrew Plaza
 * @public
 * @param {string} provider - (http://localhost:8545)
 * @param {string} path - path of the contract
 * @param {string} name - name of the contract
 * @param {Logger} logger - logger object for debugging/output
 * @param {Object} options - provided to the contract
 */
export default class Contract {
  constructor(
    provider: string,
    path: string,
    name: string,
    logger: Logger,
    options: Object
  ) {
    this.provider = provider || null;
    this.path = (path === null ? null : path);
    this.name = `:${this.getRealName(name)}`;
    this.source = fs.readFileSync(path, 'utf8');
    this.compiledSource = solc.compile(this.source, 1);
    this.web3 = new Web3(new Web3.providers.HttpProvider(provider));
    this.contract = null;
    this.logger = logger;
    this.options = options;
    if (this.name === '') {
      throw new Error('Supply a valid Contract Name to the Contract Object');
    }
  }

  /**
   * Gets the name of the contract without ':' preceding it
   * @param {string} name - name of contract to process
   * @return {string}
   * @private
   */
  getRealName(name: string): string {
    if (name.charAt(0) === ':') {
      name = name.substr(1);
      this.getRealName(name);
    }
    return name;
  }

  /**
   * Returns the source Solidity code of the contract
   * @author Andrew Plaza
   * @return {string} - source
   */
  getSource() {
    return this.source.toString();
  }

  /**
   * Returns the runtime source map of compiled solidity code
   * @author Andrew Plaza
   * @return {string}
   */
  getRuntimeMap() {
    return this.compiledSource.contracts[this.name].srcmapRuntime;
  }

  /**
   * Returns the compiled bytecode of the Solidity source
   * @author Andrew Plaza
   * @return {string}
   */
  getBytecode() {
    return this.compiledSource.contracts[this.name].bytecode;
  }

  /**
   * Returns the name of the compiled Solidity Contract in the format :<NAME>
   * @return {string}
   */
  getName() {
    return this.name;
  }

  /**
   * returns the http provider in format `http://localhost:<PORT>`
   * @return {string}
   */
  getProvider() {
    return this.provider;
  }

  /**
   * returns path of smart contract being debugged
   * @return {string}
   */
  getPath() {
    return this.path;
  }

  /**
   * returns the ABI of the smart contract
   * @param {boolean} json - returns json if true
   * @return {string}
   */
  getABI(json: boolean) {
    const ABI = this.compiledSource.contracts[this.name].interface;
    if (json) return JSON.parse(ABI);
    else return ABI;
  }

  /**
   * deploys a contract to the blockchain (TestRPC)
   * @author Andrew Plaza
   */
  deploy() {
    const bytecode = this.getBytecode();
    const abi = this.getABI(true);
    let ContractInstance = this.web3.eth.contract(abi);

    this.contract = ContractInstance.new({
      data: bytecode,
      gas: 1000000 * 2,
      from: this.web3.eth.coinbase,
    });
  }

  /**
   * test if an arbitrary contract works correctly
   * @author Andrew Plaza
   * @param {function} cb: callback function
   */
  test(cb) {
    let contract = this.web3.eth.contract(this.contract.abi)
      .at(this.contract.address);
    cb(contract);
  }
}

