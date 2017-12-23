#! /usr/bin/env node

const SolidityParser = require('solidity-parser');

const result = 
  SolidityParser.parseFile("./examples/example_solidity/Augur/Augur.sol", 'imports');
