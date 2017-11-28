#!/usr/bin/env node
const Web3 = require('web3');
const Logger = require('./../logger');
const {Accounts, events} = require('./../types');
const {waitBlock, sleep} = require('./../utils');


// need: provider, abi, data, gas, from
/**
 * Deploy contract child process
 * @param {Object} options - Object of options for contract deployment
 */
async function deploy(options) {
  const logger = new Logger(options.loggerLevel);
  const web3 = new Web3(new Web3.providers.HttpProvider(options.provider));
  let ContractInstance = web3.eth.contract(options.abi);
  let contract = ContractInstance.new({
    data: options.data,
    gas: options.gas,
    from: getAcc(options.from, web3),
  });
  if (contract === undefined)
    throw new Error('Contract could not be deployed');
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

