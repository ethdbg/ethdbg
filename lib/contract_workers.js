#!/usr/bin/env node
const Web3 = require('web3');
const {Accounts} = require('./types');
const util = require('util');


// need: provider, abi, data, gas, from
/**
 * Deploy contract child process
 * @param {Object} options - Object of options for contract deployment
 */
function deploy(options) {
  const web3 = new Web3(new Web3.providers.HttpProvider(options.provider));
  let ContractInstance = web3.eth.contract(options.abi);
  console.log(web3.eth.coinbase);
  let contract = ContractInstance.new({
    data: options.data,
    gas: options.gas,
    from: getAcc(options.from, web3),
  });
  process.send(contract);
}

function getAcc(acc, web3) {
  switch (acc) {
    case Accounts.coinbase:
      return web3.eth.coinbase;
    default:
      throw new Error('could not parse account');
  }
}
process.on('message', (msg) => {
  console.log(msg);
  deploy(JSON.parse(msg));
});

