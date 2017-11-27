const Web3 = require('web3');
const {events} = require('./../types');

/**
 * worker for contract.runSolidityMethod
 * @param{Object} options - options to instantiate web3 and testContract
 * options.args - must be a BigNumber/serialized
 */
function runSolidityMethod(options) {
  const web3 = new Web3(new Web3.providers.HttpProvider(options.provider));
  console.log(options.abi);
  console.log(options.address);
  let testContract = web3.eth.contract(options.abi)
    .at(options.address);
  let result;
  web3.eth.defaultAccount = web3.eth.coinbase;
  // TODO: check if arg is an integer
  options.args = options.args.map((arg) => {
    return web3.toBigNumber(arg);
  });
  if (options.args !== null && options.args !== undefined) {
    result = testContract[options.name](...options.args);
  } else {
    result = testContract[options.name]();
  }
  // let result = execFuncByName(options.name, testContract, options.args);
  process.send(result);
}

// the arguments we get as a message from parent process
process.on(events.message, (msg) => {
  runSolidityMethod(JSON.parse(msg));
});
