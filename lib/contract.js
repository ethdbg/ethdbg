const fs = require('fs');
const solc = require('solc');
const {fork} = require('child_process');
const {Accounts} = require('./types');
const {events} = require('./types');
const {
  waitForEventWithTimeout,
  chckVar,
} = require('./utils');

/**
 * Manages deploying and testing smart contracts to the testRPC
 * Manages contracts with web3
 * uses web3 version 0.20.0 API large changes to web3 API in v1.0.0betaX api
 * @author Andrew Plaza
 * @public
 * @param {Logger} logger - logger object for debugging/output
 * @param {string} name - name of the contract
 * @param {Object} options - provided to the contract
 *  - compiledContract: the compiled Contract corresponding to the name
 *  in the previous parameters
 *  - path: the path to the source file of the contract
 */
class Contract {
  constructor(logger, name, options) {
    this.path = (chckVar(options.path) ? options.path : null);
    this.name = `:${this.getRealName(name)}`;
    if (!chckVar(options.path) && chckVar(options.compiledContract)) {
      this.source = null;
      this.compiledSource = options.compiledContract;
    } else {
      this.source = fs.readFileSync(options.path, 'utf8');
      this.compiledSource = solc.compile(this.source, 1).contracts[this.name];
    }
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
   * @private
   */
  getSource() {
    return this.source.toString();
  }

  /**
   * Returns the runtime source map of compiled solidity code
   * @return {string}
   * @private
   */
  getRuntimeMap() {
    return this.compiledSource.srcmapRuntime;
  }

  /**
   * Returns the compiled bytecode of the Solidity source
   * @return {string}
   * @private
   */
  getBytecode() {
    return this.compiledSource.bytecode;
  }

  /**
   * Returns the name of the compiled Solidity Contract in the format :<NAME>
   * @return {string}
   * @private
   */
  getName() {
    return this.name;
  }

  /**
   * returns path of smart contract being debugged
   * @return {string}
   * @private
   */
  getPath() {
    return this.path;
  }

  /**
   * returns the ABI of the smart contract
   * @param {boolean} json - returns json if true
   * @return {string}
   * @privatk
   */
  getABI(json) {
    const ABI = this.compiledSource.interface;
    if (json) return JSON.parse(ABI);
    else return ABI;
  }

  /**
   * deploys a contract to the blockchain (TestRPC)
   * @param{string} provider - web3 provider to deploy contract to
   * @example
   * contract.deploy('http://localhost:8545');
   * @private
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
   * @private
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
    return result;
  }

  /**
   * checks if a contract is undefined
   * throws error if so
   */
  checkContract() {
    if (this.contract === undefined || this.contract === null) {
      throw new Error('Contract not defined. It was probably never deployed');
    }
  }

  /**
   * initialize event handlers for contract workers
   * @param{ChildProcess} socket - the child process emitting events
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
