#! /usr/bin/env node
var Web3 = require("web3");
var fs = require("fs");
var solc = require("solc");

/**
 * @param{data} string - Solidity Contract Bytecode
 * @param{httpProvider} string - host and port of running testRPC
 */
function deployContract(httpProvider, contractPath, contractName) {
  console.log("GET  here");
  const web3 = new Web3(new Web3.providers.HttpProvider(httpProvider));
  const input = fs.readFileSync(contractPath, 'utf8');
  // compiled contract
  const output = solc.compile(input.toString(), 1);
  
  const bytecode = '0x' + output.contracts[contractName].bytecode;

  const abi = JSON.parse(output.contracts[contractName].interface);
  let Contract = web3.eth.contract(abi);
 
  var ContractInstance = Contract.new({data: bytecode, gas: 1000000*2, from: web3.eth.coinbase});
  console.log(ContractInstance.transactionHash);
}

/**
 * @param{address} String - address of smart contract
 * @param{testFunction} Function - function to test smartContract with
 */
function testContract(address, testFunction) {
    // Reference to the deployed contract
    const token = contract.at(address);
    // Destination account for test
    const dest_account = '0x002D61B362ead60A632c0e6B43fCff4A7a259285';

    // Assert initial account balance, should be 100000
    const balance1 = token.balances.call(web3.eth.coinbase);
    console.log(balance1 == 1000000);
    testFunction(token);
}


  deployContract(
    'http://localhost:8545', 
    './../../examples/example_solidity/Greeter.sol', 
    ':greeter'
  );
