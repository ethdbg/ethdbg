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
  const ethdbg = new Debugger({
    loggerLevel: 6,
    testRPC: {
      fork: false,
      network_id: 1337,
    }
  });

  // add contract for debugging
  //  ethdbg.add({path: './../examples/example_solidity/greeter.sol'});
  // ethdbg.toggleBreakpoint('greeter', 30);
  await ethdbg.start();

  /*
  let contract = new Contract(logger,
    'greeter', {path: './../examples/example_solidity/greeter.sol'});
  await contract.deploy({
    provider: 'http://localhost:8546',
    args: ['hello'],
  });

  logger.debug('running solidity greet');
  let result = await contract.runSolidityMethod('greet');
  logger.debug(result);
  */
} test();
