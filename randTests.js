#! /usr/bin/env node

const solc = require('solc');
const fs = require('fs');
const ContractManager = require('./lib/contract_manager');
const Contract = require('./lib/contract');
const Logger = require('./lib/logger');
const Web3 = require('web3');


const simple = './examples/example_solidity/simple.sol';
const source = fs.readFileSync(simple, 'utf8');

const logger = new Logger(5);
let simple_storage = new Contract(logger, 'SimpleStorage', {
  source,
});
console.log(simple_storage.provider);
console.log(simple_storage);
console.log(simple_storage.AST);
console.log(simple_storage.compiledSource);
console.log(simple_storage.source);
console.log(simple_storage.getSource());

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
/*
async function test() {
  const simple = './examples/example_solidity/greeter.sol';
  const source = fs.readFileSync(simple, 'utf8');
  const compiledSource = solc.compile(source, 1);
  console.log(compiledSource);
} test();
*/

/*
function trimRight(str) {
  return str.replace(/[0]+|[0]+$/g , '');
}

function test() {
  const string = 'lol';
  console.log(typeof string === 'string');
} test();

*/

