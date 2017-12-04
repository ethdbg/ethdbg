#!/usr/bin/env node

const GanacheWrapper = require('./ganache_wrapper');
const ContractManager = require('./contract_manager');
const Logger = require('./logger');
const {t_BigNumber} = require('./types');
/**
 * Testing outside of the tester.
 * @author Andrew Plaza
 */
async function test() {
  const logger = new Logger(5);
  let cManager = new ContractManager(logger);
  cManager.add('./../examples/example_solidity/simple.sol');
  const testRpc = new GanacheWrapper(logger, {});
  await testRpc.init();
  testRpc.initEvents();
  let contract = cManager.get('SimpleStorage');
  await contract.deploy('http://localhost:8546');
  await contract.initTxManager('http://localhost:8546');
  logger.debug(await contract.getSourceLocationFromPC(56));
  logger.debug('Deployed contract!');
  logger.debug('BEGIN RUNNING SET');
  let result = await contract.runSolidityMethod(
    'set',
    'http://localhost:8546',
    [123322]
  );
  logger.debug(`END RUNNING 'SET' with argument '123322'`);
  logger.debug(`BEGIN RUNNING 'GET' with no arguments`);
  result = await contract.runSolidityMethod('get', 'http://localhost:8546');
  logger.debug(`END RUNNING 'GET'`);
  logger.debug(`Value stored was: ${result.toString(t_BigNumber.base10)}`);
} test();
