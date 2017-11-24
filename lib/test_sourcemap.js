#! /usr/bin/env node
const SourceMap = require('./source_map');
const Logger = require('./logger');
const Contract = require('./contract');

const logger = new Logger(5);
const contract = new Contract(
  'http://localhost:8546',
  '../examples/example_solidity/simple.sol',
  'SimpleStorage',
  logger,
  {},
);
const srcmap = new SourceMap(contract, logger);
srcmap.mapLineNums();
