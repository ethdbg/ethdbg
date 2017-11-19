#! /usr/bin/env node
const fs = require('fs');
const SourceMap = require('./../source_map.js');


function test(source) {
  this.source_map = new SourceMap(source, 'SimpleStorage');
}

const source = fs.readFileSync('./../examples/example_solidity/simple.sol', 'utf8');
test(source);
