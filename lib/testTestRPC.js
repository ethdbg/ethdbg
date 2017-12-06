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
  let cManager = new ContractManager(logger, {provider: 'http://localhost:8546'});
  cManager.add('./../examples/example_solidity/simple.sol');
  let contract = cManager.get('SimpleStorage');
  const testRpc = new GanacheWrapper(logger);
  await testRpc.init();
  testRpc.initEvents();
  await contract.deploy('http://localhost:8546');
  let result = await contract.runSolidityMethod(
    'set',
    null,
    [123322]
  );
  logger.debug(await contract.getSourceLocationFromPC(8, 'SimpleStorage:set', {
    tx: contract.getLatestTxHash(),
  }));

  result = await contract.runSolidityMethod('get');
  logger.debug(`Value stored was: ${result.toString(t_BigNumber.base10)}`);
} test();
