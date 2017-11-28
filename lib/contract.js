const fs = require('fs');
const solc = require('solc');
const {fork} = require('child_process');
const {Accounts} = require('./types');
const {events} = require('./types');
const {waitForEventWithTimeout} = require('./utils');

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
class Contract {
  constructor(provider, path, name, logger, options) {
    this.provider = provider || null;
    this.path = (path === null ? null : path);
    this.name = `:${this.getRealName(name)}`;
    this.source = fs.readFileSync(path, 'utf8');
    this.compiledSource = solc.compile(this.source, 1);
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
    return this.compiledSource.contracts[this.name].srcmapRuntime;
  }

  /**
   * Returns the compiled bytecode of the Solidity source
   * @return {string}
   * @private
   */
  getBytecode() {
    return this.compiledSource.contracts[this.name].bytecode;
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
   * returns the http provider in format `http://localhost:<PORT>`
   * @return {string}
   * @private
   */
  getProvider() {
    return this.provider;
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
    const ABI = this.compiledSource.contracts[this.name].interface;
    if (json) return JSON.parse(ABI);
    else return ABI;
  }

  /**
   * deploys a contract to the blockchain (TestRPC)
   * @private
   */
  async deploy() {
    const bytecode = this.getBytecode();
    const abi = this.getABI(true);
    const deployFork = fork('./contract_workers/deploy');
    this.initHandlers(deployFork);
    deployFork.send(JSON.stringify({
      provider: this.provider,
      abi,
      data: bytecode,
      gas: 1000000 * 2,
      from: Accounts.coinbase,
      loggerLevel: this.logger.level,
    }));
    this.contract = await waitForEventWithTimeout(
      deployFork,
      events.message,
      3000,
      'contract deploy timed out'
    );
  }

  /**
   * Runs a smart contract on this method
   * @param {string} name - name of method to run on contract
   * @param {Array} args - args of method for contract
   * @return {Object} result of the solidity code that was run
   */
  async runSolidityMethod(name, args) {
    this.checkContract();
    const runCode = fork('./contract_workers/runSolidityMethod');
    this.initHandlers(runCode);
    runCode.send(JSON.stringify({
      provider: this.provider,
      abi: this.contract.abi,
      address: this.contract.address,
      name,
      args,
      logger: this.logger,
    }));
    let result = await waitForEventWithTimeout(
      runCode,
      events.message,
      3000,
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
