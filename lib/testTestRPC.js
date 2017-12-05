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
  const testRpc = new GanacheWrapper(logger, {});
  await testRpc.init();
  testRpc.initEvents();
  let contract = cManager.get('SimpleStorage');
  await contract.deploy();
  let result = await contract.runSolidityMethod(
    'set',
    null,
    [123322]
  );
  //await contract.initCodeManager();
  let i;
  /*for(i=0;i<100;i++) {
    logger.debug(await contract.getSourceLocationFromPC(i));
  } */
  result = await contract.runSolidityMethod('get');
  logger.debug(`Value stored was: ${result.toString(t_BigNumber.base10)}`);
} test();
