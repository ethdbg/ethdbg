#!/home/ubuntu/.nvm/versions/node/v9.3.0/bin/node

// Garbage test file. Disregard/remove. - Romulus10

const REPL = require('./repl.js');
const VM = require('ethereumjs-vm');
const solc = require('solc');

let machine = new VM();
let repl = new REPL();
let contract = `contract mortal {
    address owner;

    function mortal() { owner = msg.sender; }

    function kill() { if (msg.sender == owner) selfdestruct(owner); }
}`;
let mid = "x = 1; y = 1s; return x+y;";
let result = '';
console.log("Final: " + result);

let mid2 = 'function arbitrary() { ' + mid + ' }';

let code_split = contract.split('\n');

code_split.splice(5, 0, mid2);

let code = code_split.join();

let mach_code = solc.compile(code);
console.log(mach_code.contracts);
this.result = result;
console.log("RESULT: " + result);
for (var contractName in mach_code.contracts) {
    console.log("CONTRACTNAME: " + contractName);
    machine.runCode({
        code: Buffer.from(mach_code
            .contracts[contractName]
            .bytecode, 'hex'),
        gasLimit: Buffer.from('ffffffff', 'hex')
    }, (err, results) => {
        console.log("RETURN STRING: " + results.return.toString('hex'));
        this.result = results.return.toString('hex');
    });
    console.log("THIS.RESULT: " + this.result);
}