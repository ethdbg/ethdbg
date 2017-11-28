const Web3 = require('web3');
const _ = require('lodash');
const Logger = require('./../logger');
const {waitBlock} = require('./../utils');
const {events} = require('./../types');

/**
 * worker for contract.runSolidityMethod
 * @param{Object} options - options to instantiate web3 and testContract
 * options.args - must be a BigNumber/serialized
 */
async function runSolidityMethod(options) {
  const logger = new Logger(options.loggerLevel);

  const web3 = new Web3(new Web3.providers.HttpProvider(options.provider));
  let testContract = web3.eth.contract(options.abi)
    .at(options.address);
  let result;
 
  const funcABI = _.find(testContract.abi, (func) => {
    return func.name === options.name;
  });

  if (options.args !== null && options.args !== undefined) {
    logger.debug(`executing '${options.name}' with args '${options.args}'`);
    result = testContract[options.name](
      ...options.args,
      {from: web3.eth.accounts[0]}
    );
    logger.debug('Sent method transaction!');
  } else {
    logger.debug(`executing '${options.name}'`);
    result = testContract[options.name]({from: web3.eth.accounts[0]});
  }

  let receipt;
  try {
    // if function is modifying state, wait for tx to be mined
    if (!funcABI.constant) {
      receipt = await waitBlock(web3, result, logger);
    } else receipt = result;
  } catch (err) {
    process.emit('error', err);
    process.exit();
  }

  logger.debug(`result of transaction ${options.name}: ${result}`);
  process.send(receipt);
  return;
}

// the arguments we get as a message from parent process
process.on(events.message, (msg) => {
  runSolidityMethod(JSON.parse(msg));
});
