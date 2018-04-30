#!/usr/bin/env node
const Debugger = require('./debugger');
const Logger = require('./logger');

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
    },
  });

  const logger = new Logger(6);
  // add contract for debugging
  ethdbg.add('./../examples/example_solidity/greeter.sol');
  ethdbg.toggleBreakpoint('./../examples/example_solidity/greeter.sol', 30);
  await ethdbg.run();
  await ethdbg.start();
  await ethdbg.events().listen(); ethdbg.started = true;

 const contract =
   ethdbg.cManager.getBySource('./../examples/example_solidity/greeter.sol')[0];
  logger.debug('running solidity greet');
  let result = await contract.runSolidityMethod('greet');
  logger.debug(result);

} test();
