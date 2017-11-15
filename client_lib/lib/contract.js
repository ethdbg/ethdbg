#! /usr/bin/env node
var Web3 = require("web3");
var fs = require("fs");
var solc = require("solc");
const eth_new_contract = require("eth-new-contract");


/**
 *@author Andrew Plaza
 *
 * Class for deploying and testing smart contracts to the testRPC
 * uses web3 version 0.20.0 API 
 * large changes to web3 API in v1.0.0betaX api
 */
class Contract {
  
  /**
   *@author Andrew Plaza
   * @param{provider} http provider (http://localhost:8545
   * @param{contract_path} path of the contract
   * @param{options} options, TBA
   */
  constructor(provider, contract_path, contract_name, options) {
    debugger;
    this.provider = provider;
    this.contract_path = contract_path;
    this.contract_name = contract_name;
    this.web3 = new Web3(new Web3.providers.HttpProvider(provider));
    this.new_contract = eth_new_contract.default(this.web3);
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
    const output = solc.compile(input.toString());
    const bytecode = output.contracts[this.contract_name].bytecode;
    const abi = JSON.parse(output.contracts[this.contract_name].interface);
    let Contract = this.web3.eth.contract(abi);
    this.contract = Contract.new({
      data: bytecode, 
      gas: 1000000*2, 
      from: this.web3.eth.coinbase
    });
  }
  /**
   * test if an arbitrary contract
   * works correctly
   * @param{cb} callback function
   *  parameters available to callback:
   *    @param{contract} the deployed contract
   */
  test(cb) {
    let test_contract = this.web3.eth.contract(this.contract.abi);
    let test_contract_instance = test_contract.at(this.contract.address);
    cb(test_contract);
  }
}

let contract = new Contract('http://localhost:8545', './../../examples/example_solidity/Greeter.sol', ':greeter');
contract.deploy();

contract.test((contract) => {
  let result = contract.greet('hello');
  console.log(result);
});
