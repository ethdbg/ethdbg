const util = require('util');

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

let fun = `\nfunction arbitrary() public returns (uint z) { 
  ${code} 
}`;

let code = (`${src} ${fun} 
}`);

const options = {
    source: code,
};

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