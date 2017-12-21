#!/home/ubuntu/.nvm/versions/node/v9.3.0/bin/node

// Garbage test file. Disregard/remove. - Romulus10

const REPL = require('./repl.js');

let logger = new Logger(5);
let machine = new VM();
let repl = new REPL();
let nada = '';
let result = repl.execute(machine, "x = 1; y = 1; return x+y;", nada);
console.log("Final: " + result);