#!/usr/bin/env node

const VM = require('ethereumjs-vm');
const solc = require('solc');
const Contract = require('./contract');
const Logger = require('./logger');

let machine = new VM();
let logger = new Logger(5);

let src = `
pragma solidity ^0.4.16; 
contract mortal { 
  address owner; 
  function mortal() public { 
    owner = msg.sender; 
  } 
  function kill() public { 
    if (msg.sender == owner) selfdestruct(owner); 
  }`;

let mid = `uint x; 
           uint y; 
           x = 1; 
           y = 1; 
           return x+y;`;

let mid2 = `\nfunction arbitrary() public returns (uint z) { 
  ${mid} 
}`;

let code = (`${src} ${mid2} 
}`);

console.log();
console.log(`Final Source:\n ${code}`);
console.log();

const options = {
    source: code,
};

let mach_code = new Contract(logger, 'mortal', options);
console.log(mach_code.getBytecode());
console.log("CONTRACTNAME: " + mach_code.getName());
console.log(mach_code.getName() + ': ' + mach_code.getBytecode());
console.log("BYTECODE: " + mach_code.getBytecode());
machine.runCode({
    code: Buffer.from(mach_code.getBytecode(), 'hex'),
    gasLimit: Buffer.from('ffffffff', 'hex')
}, (err, results) => {
    console.log();
    console.log("RETURN STRING TWO: " + results.return.toString('hex'));
    this.result = results.return.toString('hex');
    console.log("Second execution passes this point.");
    console.log();
    console.log("THIS.RESULT: " + this.result);
});
