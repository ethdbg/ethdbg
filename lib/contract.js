const fs = require('fs');
const solc = require('solc');
const Web3 = require('web3');
const proxiedWeb3Handler = require('./proxy_web3');
const { fork } = require('child_process');
const { Accounts } = require('./types');
const { events } = require('./types');
const {
  waitForEventWithTimeout,
  isDef,
} = require('./utils');
// TODO: Create data structure of all addresses/txHashes
// TODO: clean up constructor as much as possible
// associated with deploying contracts
/**
 * Manages deploying and testing smart contracts to the testRPC
 * Manages contracts with web3
 * uses web3 version 0.20.0 API large changes to web3 API in v1.0.0betaX api
 * @author Andrew Plaza
 * @private
 * @param {Logger} logger - logger object for debugging/output
 * @param {string} name - name of the contract
 * @param {Object} options - provided to the contract
 *  - compiledContract: the compiled Contract corresponding to the name
 *  in the previous parameters
 *  - path: the path to the source file of the contract
 *  - source: direct source code of the contract as a utf8 string
 *  - AST: AST of compiled contracts
 *  - provider: a provider to use for contract deployment
 */
class Contract {
  constructor(logger, name, options) { // eslint-disable-line require-jsdoc
    this.logger = logger;
    this.path = (isDef(options.path) ? options.path : null);
    this.name = `:${this.getRealName(name)}`;
    // TODO Should probably get rid of this option
    if (isDef(options.compiledContract) && isDef(options.AST)) {
      this.source = options.source;
      this.compiledSource = options.compiledContract;
      this.AST = options.AST;
    } else if (isDef(options.source)) {
      this.source = options.source;
      const cSource = solc.compile(options.source, 1);
      this.compiledSource = cSource.contracts[this.name];
      if (!isDef(cSource.sources)) {
        throw new Error('Contract could not be compiled due to error');
      }
      this.AST = cSource.sources[''].AST;
      this.fullCSource = cSource;
    } else {
      if (!isDef(options.path)) {
        throw new Error('One of path, source, or ' +
          'compiledContract and AST must be specified ' +
          'in options passed to Contract constructor');
      }
      this.source = fs.readFileSync(options.path, 'utf8');
      const cSource = solc.compile(this.source, 1);
      this.compiledSource = cSource.contracts[this.name];
      if (!isDef(cSource.sources)) {
        throw new Error('Contract could not be compiled due to error');
      }
      this.AST = cSource.sources[''].AST;
      this.fullCSource = cSource;
    }
    this.options = options;
    this.latestTxHash = null;
    if (this.name === '') {
      throw new Error('Supply a valid Contract Name to the Contract Object');
    }
    this.provider = isDef(options.provider) ?
      options.provider : 'http://localhost:8546';
    this.web3 = new Web3(new Web3.providers.HttpProvider(this.provider));
    //this.proxiedWeb3 = new Proxy(this.web3, proxiedWeb3Handler);
    this.associatedAddr = [];
  }

  /**
   * Gets the name of the contract without ':' preceding it
   * @param {string} name - name of contract to process
   * @return {string}
   * @public
   */
  getRealName(name) {
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
   * @public
   */
  getSource() {
    return this.source.toString();
  }

  /**
   * Returns the hexCode gotten from web3
   * @return{string}
   */
  async getHexCode() {
    if (!isDef(this.getAddress())) {
      throw new Error(`Contract must be deployed for this function`);
    }
    return await this.proxiedWeb3.eth.getCode(this.getAddress());
  }

  /**
   * Returns the runtime source map of compiled solidity code
   * @return {string}
   * @public
   */
  getRuntimeMap() {
    return this.compiledSource.srcmapRuntime;
  }

  /**
   * Returns the compiled bytecode of the Solidity source
   * @return {string}
   * @public
   */
  getBytecode() {
    return this.compiledSource.bytecode;
  }

  /**
   * Returns compiled runtime bytecode
   * @return {string}
   * @public
   */
  getRuntimeBytecode() {
    return this.compiledSource.runtimeBytecode;
  }

  /**
   * Returns the name of the compiled Solidity Contract in the format :<NAME>
   * @return {string}
   * @public
   */
  getName() {
    return this.name;
  }

  /**
   * returns path of smart contract being debugged
   * @return {string}
   * @public
   */
  getPath() {
    return this.path;
  }

  /**
   * returns the ABI of the smart contract
   * @param {boolean} json - returns json if true
   * @return {string}
   * @public
   */
  getABI(json) {
    const ABI = this.compiledSource.interface;
    if (json) return JSON.parse(ABI);
    else return ABI;
  }

  /**
   * returns the AST of the contracts
   * @return{Object}
   */
  getAST() {
    return this.AST;
  }

  /**
   * Returns full Compiled Source
   * @return{Object}
   */
  getFullCompiledSource() {
    if (!isDef(this.fullCSource)) {
      throw new Error('Full Compiled Source does not exist');
    }
    return this.fullCSource;
  }

  /**
   * get the address of a deployed contract
   * @return{string} the adress of a contract
   */
  getAddress() {
    this.checkContract();
    return this.contract.address;
  }

  /**
   * Get the transaction hash of a deployed contract
   * @return{string}
   */
  getTxHash() {
    this.checkContract();
    return this.contract.transactionHash;
  }

  /**
   * Get the latest transaction hash from the last run method on contract
   * @return{string}
   */
  getLatestTxHash() {
    if (!isDef(this.latestTxHash)) throw new Error('empty transaction hash');
    return this.latestTxHash;
  }

  /**
   * Get the receipt from a deployed contract
   * @return{Object}
   */
  getDeployReceipt() {
    this.checkContract();
    return this.contract.receipt;
  }

  /**
   * Returns the array with addresses that are this contract
   * @return{Array}
   */
  getAssocAddr() {
    return this.associatedAddr;
  }

  /**
   * associate this contract instance with a deployed address
   * @param{string} addr - address of deployed contract to
   * associate with address
   * @return{Contract}
   */
  associate(addr) {
    if (!this.associatedAddr.includes(addr)) {
      this.associatedAddr.push(addr);
    }
    return this;
  }

  /**
   * Get the transaction object from transaction Hash
   * @param{string} txHash - transaction Hash to get transaction obj for
   * @param{string|undefined|null} provider - url for Http Web3 provider
   * @return{Object}
   */
  async getTransaction(txHash, provider) {
    if (!isDef(txHash)) {
      throw new Error(`must give a valid txHash`);
    }
    if (isDef(provider)) {
      const web3 = new Web3(new Web3.providers.HttpProvider(provider));
      const proxiedWeb3 = new Proxy(web3, proxiedWeb3Handler);
      return await proxiedWeb3.eth.getTransaction(txHash);
    } else {
      return await this.proxiedWeb3.eth.getTransaction(txHash);
    }
  }

  /**
   * deploys a contract to the blockchain (TestRPC)
   * @param{Object|undefined|null}
   *  - `provider`: web3 provider
   *  - `args`: Array of arguments to pass to constructor function
   * to deploy contract on
   * @example
   * contract.deploy({provider: 'http://localhost:8545'});
   * @example
   * contract.deploy({args: ['hello']});
   * @public
   */
  async deploy(options) {
    const prov = (isDef(options) && isDef(options.provider))
      ? options.provider : this.provider;
    const args = (isDef(options) && isDef(options.args)) ? options.args : null;
    const bytecode = this.getBytecode();
    const abi = this.getABI(true);
    const deployFork = fork('./contract_workers/deploy');
    this.constructor.initHandlers(deployFork);
    deployFork.send(JSON.stringify({
      args,
      provider: prov,
      abi,
      data: bytecode,
      gas: 1000000 * 2,
      from: Accounts.coinbase,
      loggerLevel: this.logger.level,
    }));
    this.contract = await waitForEventWithTimeout(
      deployFork,
      events.message,
      15000,
      'contract deploy timed out'
    );
  }

  /**
   * gets the code from web3 (static, fork, as opposed to getHexCode)
   * mostly used as a utlity function not attached to Contract
   * @param{string} address - address of deployed contract to get code from
   * @param{string} provider - Eth testRPC to get code from
   * @param{Object} options - optional parameters
   *  - loggerLevel: level of logger
   * @return{string}
   */
  static async getCode(address, provider, options) {
    const getCode = fork('./contract_workers/getCode.js');
    this.initHandlers(getCode);
    getCode.send(JSON.stringify({
      address,
      provider,
      loggerLevel: options.loggerLevel ? options.loggerLevel : 1,
    }));
    let result = await waitForEventWithTimeout(
      getCode,
      events.message,
      3000,
      `Could not get code for ${address} at ${provider}`
    );
    return result;
  }

  /**
   * Runs a smart contract on this method
   * @param {string} name - name of method to run on contract
   * @param {string|undefined|null} provider - provider
   * that holds deployed contract
   * @param {Array} args - args of method for contract
   * @return {Object} results and information about solidity code that was run
   * @public
   * @exmple
   * contract.runSolidityMethod('get', 'http://localhost:8545');
   * @example
   * contract.runSolidityMethod(
   *  'set',
   *  'http://localhost:8545',
   *  [124234]
   * );
   * @example
   * contract.runSolidityMethod(
   *  'store',
   *  'http://localhost:8545',
   *  ['hello', 382]
   *  );
   */
  async runSolidityMethod(name, provider, args) {
    this.checkContract();
    const prov = isDef(provider) ? provider : this.provider;
    const runCode = fork('./contract_workers/runSolidityMethod');
    this.constructor.initHandlers(runCode);
    runCode.send(JSON.stringify({
      provider: prov,
      abi: this.contract.abi,
      address: this.contract.address,
      name,
      args,
      loggerLevel: this.logger.level,
    }));
    let result = await waitForEventWithTimeout(
      runCode,
      events.message,
      15000,
      `Solidity function '${name}' with arguments '${args}' timed out`
    );
    this.latestTxHash = {
      txHash: result.receipt.transactionHash,
      originalTx: result.originalTx,
    };
    return result;
  }

  /**
   * checks if a contract is undefined
   * throws error if so
   * @public
   */
  checkContract() {
    if (!isDef(this.contract)) {
      throw new Error('Contract not defined. It was probably never deployed');
    }
  }

  /**
   * initialize event handlers for contract workers
   * @param{ChildProcess} socket - the child process emitting events
   * @public
   */
  static initHandlers(socket) {
    socket.on('error', (err) => {
      throw new Error(err);
    });
    socket.on('close', (msg) => { });
  }
}

module.exports = Contract;
exports.default = Contract;
