#!/usr/bin/env node

const GanacheWrapper = require('./ganache_wrapper');
const Contract = require('./contract');
const Logger = require('./logger');
const SourceMap = require('./source_map');
/**
 * Testing outside of the tester.
 * @author Andrew Plaza
 */
async function test() {
  const logger = new Logger(5);
  let contract = new Contract(
    'http://localhost:8546',
    '../examples/example_solidity/simple.sol',
    'SimpleStorage',
    logger, {},
  );
  const sourceMap = new SourceMap(logger, contract);
  const testRpc = new GanacheWrapper(logger, sourceMap, {});
  await testRpc.init();
  testRpc.initEvents();
  await contract.deploy();
  let result = await contract.runSolidityMethod('set', [123322]);
  result = await contract.runSolidityMethod('get');
} test();
