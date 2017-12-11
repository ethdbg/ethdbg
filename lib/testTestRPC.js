#!/usr/bin/env node
const ContractManager = require('./contract_manager');
const Contract = require('./contract');
const Debugger = require('./debugger');
const Logger = require('./logger');
const {t_BigNumber} = require('./types');

/**
 * Testing outside of the tester.
 * @author Andrew Plaza
 */
async function test() {
  const logger = new Logger(5);
  const ethdbg = new Debugger({loggerLevel: 5});

  // add contract for debugging
  ethdbg.add({path: './../examples/example_solidity/simple.sol'});

  await ethdbg.start();
  let contract = new Contract(logger,
    'SimpleStorage', {path: './../examples/example_solidity/simple.sol'});
  await contract.deploy('http://localhost:8546');


  logger.debug('running solidity set');
  let result = await contract.runSolidityMethod(
    'set',
    provider=null,
    [123322]
  );
  result = await contract.runSolidityMethod('get');
  logger.debug(result);
} test();
