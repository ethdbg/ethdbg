#! /usr/bin/env node
const fs = require('fs');
const Decoder = require('./../lib/util/source_map_decoder.js');
const solc = require('solc');


function test() {
  let path = './../examples/example_solidity/simple.sol';
  let source = fs.readFileSync(path, 'utf8');
  let compiledSource = solc.compile(source, 1);
  let bytecode = compiledSource.contracts[':SimpleStorage'].runtimeBytecode;
  let sourcemap = compiledSource.contracts[':SimpleStorage'].srcmapRuntime;
  const decoder = new Decoder();
  let decompressedSrc = decoder.decompressAll(sourcemap);
  decompressedSrc.forEach((match)=> {
    console.log(source.substr(match.start,match.length));
  });
}

test();
