#!/usr/bin/env node
const GanacheWrapper = require('./ganache_wrapper');
const Debugger = require('./debugger');
const ContractManager = require('./contract_manager');
const Logger = require('./logger');
const {t_BigNumber} = require('./types');

/**
 * Testing outside of the tester.
 * @author Andrew Plaza
 */
async function test() {
  const logger = new Logger(5);
  const ethdbg = new Debugger({loggerLevel: 5});

  let cManager = new ContractManager(logger, {provider: 'http://localhost:8546'});
  cManager.add('./../examples/example_solidity/simple.sol');
  const testRPC = new GanacheWrapper(logger, {fork: false})
  await testRPC.init();
  // add contract for debugging
  ethdbg.add({path: './../examples/example_solidity/simple.sol'});
  //  await ethdbg.start();
  let contract = cManager.get('SimpleStorage');
  await contract.deploy('http://localhost:8546');
  /* let result = await contract.runSolidityMethod(
    'set',
    provider=null,
    [123322]
  ); */
  // result = await contract.runSolidityMethod('get');
} test();
