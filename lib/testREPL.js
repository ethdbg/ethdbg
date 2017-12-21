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

let source = `contract mortal { address owner; function mortal() { owner = msg.sender; } function kill() { if (msg.sender == owner) selfdestruct(owner); }`;

let mid2 = 'function arbitrary() { ' + mid + ' }';

let code = (source + ' ' + mid2 + ' }');

let mach_code = new Contract(logger, 'arbitrary', { source: code });
console.log(mach_code.getBytecode());
this.result = result;
console.log("RESULT: " + result);
for (var contractName in mach_code.contracts) {
    console.log("CONTRACTNAME: " + contractName);
    console.log(contractName + ': ' + mach_code.getBytecode);
    console.log("BYTECODE: " + mach_code.getBytecode);
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
}
