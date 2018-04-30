const Web3 = require('web3');
const Logger = require('./../logger');
const {events} = require('./../types');
const {sleep} = require('./../utils');
/**
 * Worker for getting the code of a contract
 * @param{Object} options
 *  - `address` addr to get Code from
 *  - `loggerLevel` level of logger to instantiate
 *  - `provider` provider to get code from
 */
async function getCode(options) {
  const logger = new Logger(options.loggerLevel);
  const web3 = new Web3(new Web3.providers.HttpProvider(options.provider));
  web3.eth.getCode(options.address, (code) => {
    process.send(code);
  });
  process.exit(0);
}

process.on(events.message, (msg) => {
  getCode(JSON.parse(msg));
});

