#! /usr/bin/env node

const solc = require('solc');
const fs = require('fs');
const ContractManager = require('./lib/contract_manager');
const Contract = require('./lib/contract');
const Logger = require('./lib/logger');
const SolidityWrapper = require('./lib/solidity_wrapper');
const Web3 = require('web3');
const util = require('util');
const simple = './examples/example_solidity/simple.sol';
const augur = './examples/example_solidity/Augur/Augur.sol';
const greeter = './examples/example_solidity/greeter.sol';
const testC = './testC.sol';


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
  const logger = new Logger(6);
  const solc = new SolidityWrapper(augur, 'Augur');
  // console.log(solc.getLinkedSource());
} test();


/*
function trimRight(str) {
  return str.replace(/[0]+|[0]+$/g , '');
}

function test() {
  const string = 'lol';
  console.log(typeof string === 'string');
} test();

*/
/*
function deserialize(data) {
  if (data instanceof Buffer) data = data.toString();
  else if (typeof data != 'string') {
    throw new Error(
      'Cannot deserialize data which is not a string or buffer'
    );
  }
  console.log(data.substr(32));
  const event = trimZeros(data.substr(0, 32));
  let input;
  if (data.substr(32) != 'null' && data.substr(32) != 'undefined') {
    try {
      input = JSON.parse(data.substr(32));
    } catch (err) {
      console.log(err.message);
      console.log('occured in deserialize on line 55');
      console.log(`string deserializing: ${data}`);
      console.log(`substr of string: ${data.substr(32)}`);
      console.log(`event: ${data.substr(0, 32)}`);
    }
  }
  */
  /** trims _all_ zeros from a string
   * @param{string} str - string to trim zeros from
   * @return{string} - trim without leading zeros
   */
/*
  function trimZeros(str) {
    return str.replace(/[0]+|[0]+$/g, '');
  }
  return [event, input];
}


console.log('addBreakpoints000000000000000000null');
console.log(deserialize('addBreakpoints000000000000000000null'));

console.log('');
console.log('');
console.log('addBreakpoints000000000000000000{"source":"/home/insi/Projects/ETHDBG/test-project/contracts/greeter.sol","lines":[32,33]}')
console.log(deserialize('addBreakpoints000000000000000000{"source":"/home/insi/Projects/ETHDBG/test-project/contracts/greeter.sol","lines":[32,33]}'));
*/


const simpleSol = `
pragma solidity ^0.4.0;

contract SimpleStorage {
    uint storedData;

    function set(uint x) {
        storedData = x;
    }

    function get() constant returns (uint) {
        return storedData;
    }
}
`;
let logger = new Logger(6, false);
let contract = new Contract(logger, 'SimpleStorage', {source: simpleSol});

console.log(contract.getBytecode());
console.log(contract.getRuntimeBytecode());
console.log(contract.getName());


