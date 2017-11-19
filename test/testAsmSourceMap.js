#! /usr/bin/env node
const fs = require('fs');
const solc = require('solc');

function test() {
  let path = './../examples/example_solidity/Greeter.sol';
  let source = fs.readFileSync(path, 'utf8');
  let compiledSource = solc.compile(source, 1);
  let asm = compiledSource.contracts[':greeter'].assembly;
  // console.log(asm['.data']['0']['.code']);
  asm['.data']['0']['.code'].forEach((line) => {
    console.log(`${line.name} : ${source.substring(line.begin, line.end)}`);
  })
}

test();
