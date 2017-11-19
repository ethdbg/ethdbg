/**
 * @author Andrew Plaza <aplaza@liquidthink.net>
 */
const Web3 = require('web3');
const fs = require('fs');
const solc = require('solc');


/**
 *Class for deploying and testing smart contracts to the testRPC
 * uses web3 version 0.20.0 API
 * large changes to web3 API in v1.0.0betaX api
 * @author Andrew Plaza
 */
class Contract {
  /**
   * @author Andrew Plaza
   * @constructor
   * @param {string} provider - (http://localhost:8545)
   * @param {string} contractPath - path of the contract
   * @param {string} contractName - name of the contract
   * @param {Object} options - provided to the contract
   */
  constructor(provider, contractPath, contractName, options) {
    this.provider = provider || null;
    this.path = contractPath;
    this.name = `:${contractName}`;
    this.source = fs.readFileSync(contractPath, 'utf8');
    this.compiledSource = solc.compile(this.source, 1);
    this.web3 = new Web3(new Web3.providers.HttpProvider(provider));
    this.contract = null;
    this.options = options;
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
   * deploys a contract to the blockchain (TestRPC)
   * @author Andrew Plaza
   */
  deploy() {
    const bytecode = this.compiledSource.contracts[this.name].bytecode;
    const abi = JSON.parse(this.compiledSource.contracts[this.name].interface);
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

module.exports = Contract;
