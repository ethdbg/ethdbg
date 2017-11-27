#!/usr/bin/env node
const Web3 = require('web3');
const {Accounts, events} = require('./../types');


// need: provider, abi, data, gas, from
/**
 * Deploy contract child process
 * @param {Object} options - Object of options for contract deployment
 */
function deploy(options) {
  const web3 = new Web3(new Web3.providers.HttpProvider(options.provider));
  let ContractInstance = web3.eth.contract(options.abi);
  let contract = ContractInstance.new({
    data: options.data,
    gas: options.gas,
    from: getAcc(options.from, web3),
  });
  if (contract === undefined) contract = null;
  console.log(contract);
  process.send(contract);
}

/**
 * utility function to get account from
 * it's string name
 * @param{string} acc - string of account to get
 * @param{Object} web3 - web3 object
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

