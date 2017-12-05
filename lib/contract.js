const fs = require('fs');
const solc = require('solc');
const Web3 = require('web3');
const proxiedWeb3Handler = require('./proxy_web3');
const {fork} = require('child_process');
const {Accounts} = require('./types');
const {events} = require('./types');
const {
  waitForEventWithTimeout,
  chckVar,
} = require('./utils');
// TODO: Create data structure of all addresses/txHashes
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
 */
class Contract {
  constructor(logger, name, options) {
    this.logger = logger;
    this.path = (chckVar(options.path) ? options.path : null);
    this.name = `:${this.getRealName(name)}`;
    if ( chckVar(options.compiledContract) && chckVar(options.AST)) {
      this.source = options.source;
      this.compiledSource = options.compiledContract;
      this.AST = options.AST;
    } else if (chckVar(options.source)) {
      this.source = options.source;
      const cSource = solc.compile(options.source, 1);
      this.compiledSource = cSource.contracts[this.name];
      this.AST = cSource.contracts.sources[''].AST;
    } else {
      if (!chckVar(options.path)) {
        throw new Error('\
        One of path, source, or \
        compiledContract and AST must be specified \
        in options passed to Contract constructor');
      }
      this.source = fs.readFileSync(options.path, 'utf8');
      const cSource = solc.compile(this.source, 1).contracts[this.name];
      this.compiledSource = cSource.contracts[this.name];
      this.AST = cSource.contracts.sources[''].AST;
    }
    this.options = options;
    this.latestTxHash = null;
    if (this.name === '') {
      throw new Error('Supply a valid Contract Name to the Contract Object');
    }
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
    if (!chckVar(this.latestTxHash)) throw new Error('empty transaction hash');
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
   * Get the transaction object from transaction Hash
   * @param{string} provider - url for Http Web3 provider
   * @param{string} txHash - transaction Hash to get transaction obj for
   * @return{Object}
   */
  async getTransaction(provider, txHash) {
    if (!chckVar(provider) || !chckVar(txHash)) {
      throw new Error(`must give a web3 provider and valid txHash`);
    }
    this.web3 = new Web3(new Web3.providers.HttpProvider(provider));
    const proxiedWeb3 = new Proxy(this.web3, proxiedWeb3Handler);
    return await proxiedWeb3.eth.getTransaction(txHash);
  }

  /**
   * deploys a contract to the blockchain (TestRPC)
   * @param{string} provider - web3 provider to deploy contract to
   * @example
   * contract.deploy('http://localhost:8545');
   * @public
   */
  async deploy(provider) {
    const bytecode = this.getBytecode();
    const abi = this.getABI(true);
    const deployFork = fork('./contract_workers/deploy');
    this.initHandlers(deployFork);
    deployFork.send(JSON.stringify({
      provider,
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
   * Runs a smart contract on this method
   * @param {string} name - name of method to run on contract
   * @param {string} provider - provider that holds deployed contract
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
    const runCode = fork('./contract_workers/runSolidityMethod');
    this.initHandlers(runCode);
    runCode.send(JSON.stringify({
      provider,
      abi: this.contract.abi,
      address: this.contract.address,
      name,
      args,
      loggerLevel: this.logger,
    }));
    let result = await waitForEventWithTimeout(
      runCode,
      events.message,
      15000,
      `Solidity function '${name}' with arguments '${args}' timed out`
    );
    this.latestTxHash = result.transactionHash;
    return result;
  }

  /**
   * checks if a contract is undefined
   * throws error if so
   * @public
   */
  checkContract() {
    if (this.contract === undefined || this.contract === null) {
      throw new Error('Contract not defined. It was probably never deployed');
    }
  }

  /**
   * initialize event handlers for contract workers
   * @param{ChildProcess} socket - the child process emitting events
   * @public
   */
  initHandlers(socket) {
    socket.on('error', (err) => {
      throw new Error(err);
    });
    socket.on('close', (msg) => {
    });
  }
}

module.exports = Contract;
