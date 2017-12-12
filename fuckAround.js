#! /usr/bin/env node

const solc = require('solc');
const fs = require('fs');
const ContractManager = require('./lib/contract_manager');
const Contract = require('./lib/contract');
const Logger = require('./lib/logger');
const simple = './examples/example_solidity/simple.sol';
const source = fs.readFileSync(simple, 'utf8');
const Web3 = require('web3');
console.log(solc.compile(source, 1));


/*
const logger = new Logger(5);
const cManager = new ContractManager(logger);
cManager.add('./examples/example_solidity/simple.sol');
let simple_storage = cManager.get('SimpleStorage');
console.log(simple_storage);
*/


/*
 * Breakpoints and Contract Names
 *
 * VScode gives file that will be debugged (start)
 * Read that into contracts
 * Set Breakpoints  (get file path + line number)
 *  - from file path, can get the contract
 *  - from line number, can get the specific contract name
 *  - deploy contract to our TestRPC
 */
async function test() {
  const contract_path = './examples/example_solidity/simple.sol';
  let logger = new Logger(5);
  let contract = new Contract(logger, 'SimpleStorage', {path: contract_path});
  let result = await contract.deploy();
  let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
}
