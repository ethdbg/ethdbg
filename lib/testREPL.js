#!/usr/bin/env node
// REPL test script.

const REPL = require('./repl');

let machine = new VM();
let repl = REPL();
repl('uint a = 1; uint b = 1; a + b;')
    .then(result => {
        // if null is returned, it means the last command was not an expression with a return value
        if (result !== null) {
            console.log(result);
        }
    })
    .catch(err => {
        console.log(err)
    });
