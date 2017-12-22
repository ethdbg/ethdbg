#!/usr/bin/env node
// REPL test script.

const REPL = require('./repl');

let repl = REPL();
let res = repl("uint a = 1; uint b = 1; a + b;")
    .then(result => {
        // if null is returned, it means the last command was not an expression with a return value
        if (result !== null) {
            return result;
        }
    })
    .catch(err => {
        console.log(err)
    });
console.log(Promise.resolve(res));
res.then(function (result) {
    console.log(result);
});