#!/home/ubuntu/.nvm/versions/node/v9.3.0/bin/node

// Garbage test file. Disregard/remove. - Romulus10

const REPL = require('./repl.js');
const VM = require('ethereumjs-vm');
const solc = require('solc');
const Contract = require('./contract');
const Logger = require('./logger');

let machine = new VM();
let repl = new REPL();
let logger = new Logger(5);

//let src = `contract mortal { address owner; function mortal() { owner = msg.sender; } function kill() { if (msg.sender == owner) selfdestruct(owner); }`;
let src = "contract mortal { address owner; function mortal() { owner = msg.sender; } function kill() { if (msg.sender == owner) selfdestruct(owner); } } contract greeter is mortal { string greeting; function greeter(string _greeting) public { greeting = _greeting; } function greet() constant returns (string) { uint x; uint y; uint z; uint a; uint b; x = 230; y = 4; z = x + y; a = x * y; b = x / y; b = a - 10; return greeting; } }";

let mid = "x = 1; y = 1s; return x+y;";
let mid2 = 'function arbitrary() { ' + mid + ' }';

let code = (source + ' ' + mid2 + ' }');

let mach_code = new Contract(logger, 'arbitrary', { source: src });
console.log(mach_code.getBytecode());
this.result = result;
console.log("RESULT: " + result);
console.log("CONTRACTNAME: " + contractName);
console.log(contractName + ': ' + mach_code.getBytecode());
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
});
console.log("THIS.RESULT: " + this.result);
