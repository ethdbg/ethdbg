#!/usr/bin/env node

const util = require('util');
const Contract = require('./contract');
const Logger = require('./logger');

async function test() {
    let src = `x = 1; y = 1s; return x+y;`;
    let code = `
pragma solidity ^0.4.16; 
contract mortal { 
  address owner; 
  function mortal() public { 
    owner = msg.sender; 
  } 
  function kill() public { 
    if (msg.sender == owner) selfdestruct(owner); 
  }
  function arbitrary() public returns (uint z) { 
  ${src}
  }
}`;

    const options = {
        source: code,
    };

    let logger = new Logger(5);
    let mach_code = new Contract(logger, 'mortal', options);

    const runCode = Promisify(machine.runCode);

    try {
        let result = await machine.runCode({
            code: Buffer.from(mach_code.getBytecode(), 'hex'),
            gasLimit: Buffer.from('ffffffff', 'hex')
        });
        console.log(result);
    } catch (err) {
        console.log("Bad things happened.");
    }
}
test();