#! /usr/bin/env node
const fs = require('fs');
const Decoder = require('./../lib/util/source_map_decoder.js');
const solc = require('solc');


function test() {
  let path = './../examples/example_solidity/Greeter.sol';
  let source = fs.readFileSync(path, 'utf8');
  let compiledSource = solc.compile(source, 1);
  let bytecode = compiledSource.contracts[':greeter'].runtimeBytecode;
  let sourcemap = compiledSource.contracts[':greeter'].srcmapRuntime;
  const decoder = new Decoder();
  console.log(decoder.decompressAll(sourcemap));
  decoder.atIndex(40, sourcemap);
  console.log(source.substr(381, 349));
}

test();
