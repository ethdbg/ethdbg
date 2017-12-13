#!/usr/bin/env node
const Web3 = require('web3');
const Logger = require('./../logger');
const {Accounts, events} = require('./../types');
const {
  waitBlock,
  isDef,
} = require('./../utils');

// Global Unhandled Promise Rejection Error Handler, for uncaught errors
process.on('unhandledRejection', (error) => {
  console.log('Unhandled Rejection Error in Eth Debug: ', error.message);
  console.log(error);
});


// need: provider, abi, data, gas, from
/**
 * Deploy contract child process
 * Returns {
 *  abi,
 *  address,
 *  transactionHash,
 *  receipt: {
 *    tranasctionHash,
 *    transactionIndex,
 *    blockHash,
 *    blockNumber,
 *    gasUsed,
 *    cumulativeGasUsed,
 *    contractAddress,
 *    logs: Array,
 *    status: {integer},
 *  }
 *}
 * @param {Object} options - Object of options for contract deployment
 */
async function deploy(options) {
  process.cwd();
  const logger = new Logger(options.loggerLevel, './../logs/deploy.log');
  const web3 = new Web3(new Web3.providers.HttpProvider(options.provider));
  let ContractInstance = web3.eth.contract(options.abi);

  let contract;
  if (isDef(options.args)) {
    logger.debug(`executing constructor with args '${options.args}'`);
    contract = ContractInstance.new(...options.args,
      {
        data: '0x' + options.data,
        gas: options.gas,
        from: getAcc(options.from, web3),
      });
  } else {
    contract = ContractInstance.new({
      data: '0x' + options.data,
      gas: options.gas,
      from: getAcc(options.from, web3),
    });
  }
  if (!isDef(contract)) {
    throw new Error('Contract could not be deployed');
  }
  let receipt = await waitBlock(web3, contract.transactionHash, logger);
  process.send({
    abi: contract.abi,
    address: receipt.contractAddress,
    transactionHash: contract.transactionHash,
    receipt,
  });
}

/**
 * utility function to get account from
 * it's string name
 * @param{string} acc - string of account to get
 * @param{Object} web3 - web3 object
 * @return{string}
 */
function getAcc(acc, web3) {
  switch (acc) {
    case Accounts.coinbase:
      return web3.eth.coinbase;
    default:
      throw new Error('could not parse account');
  }
}
process.on(events.message, (msg) => {
  deploy(JSON.parse(msg));
});

