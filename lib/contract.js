#! /usr/bin/env node

let Web3 = require('web3');
let fs = require('fs');
let solc = require('solc');
const ethNewContract = require('eth-new-contract');
// const _ = require('lodash');


/**
 *@author Andrew Plaza
 *
 * Class for deploying and testing smart contracts to the testRPC
 * uses web3 version 0.20.0 API
 * large changes to web3 API in v1.0.0betaX api
 */
module.exports = class Contract {
  /**
   * @author Andrew Plaza
   * @param{HttpProvider} provider (http://localhost:8545
   * @param{string} contractPath: path of the contract
   * @param{string} contractName: name of the contract
   * @param{Array} options provided to the contract
   */
  constructor(provider, contractPath, contractName, options) {
    this.provider = provider;
    this.contract_path = contractPath;
    this.contract_name = contractName;
    this.web3 = new Web3(new Web3.providers.HttpProvider(provider));
    this.new_contract = ethNewContract.default(this.web3);
    this.contract = null;
    this.options = options;
  }
  /**
   * @author Andrew Plaza
   * deploys a contract to the blockchain (TestRPC)
   *
   */
  deploy() {
    const input = fs.readFileSync(this.contract_path, 'utf8');
    const output = solc.compile(input.toString(), 1);
    const bytecode = output.contracts[this.contract_name].bytecode;
    const abi = JSON.parse(output.contracts[this.contract_name].interface);
    let ContractInstance = this.web3.eth.contract(abi);

    this.contract = ContractInstance.new({
      data: bytecode,
      gas: 1000000 * 2,
      from: this.web3.eth.coinbase,
    });
  }

  /**
   * @author Andrew Plaza
   * test if an arbitrary contract
   * works correctly
   * @param{function} cb: callback function
   * parameters available to callback:
   * @param{contract} contract: the deployed contract
   */
  test(cb) {
    let contract = this.web3.eth.contract(this.contract.abi)
      .at(this.contract.address);
    cb(contract);
  }
};

/**
function test() {
  let contract = new Contract('http://localhost:8545', './../../examples/example_solidity/simple.sol', ':SimpleStorage');
  contract.deploy();

  contract.test((contract) => {
    let result = contract.get();
    console.log(result);
  });
}
*/
