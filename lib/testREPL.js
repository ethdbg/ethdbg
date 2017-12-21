#!/home/ubuntu/.nvm/versions/node/v9.3.0/bin/node

// Garbage test file. Disregard/remove. - Romulus10

const REPL = require('./repl.js');
const VM = require('ethereumjs-vm');
const solc = require('solc');

debugger;

var input = {
	'cont.sol': 'import "lib.sol"; contract x { function g() { L.f(); } }'
}
function findImports (path) {
	if (path === 'lib.sol')
		return { contents: 'library L { function f() returns (uint) { return 7; } }' }
	else
		return { error: 'File not found' }
}

let machine = new VM();
let repl = new REPL();

var output = solc.compile({ sources: input }, 1, findImports)
for (var contractName in output.contracts) {
    console.log(contractName + ': ' + output.contracts[contractName].bytecode);
    console.log("CONTRACTNAME: " + contractName);
    machine.runCode({
        code: Buffer.from(output
            .contracts[contractName]
            .bytecode, 'hex'),
        gasLimit: Buffer.from('ffffffff', 'hex')
    }, (err, results) => {
        console.log("RETURN STRING: " + results.return.toString('hex'));
        this.result = results.return.toString('hex');
    });
    console.log("THIS.RESULT: " + this.result);
}


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