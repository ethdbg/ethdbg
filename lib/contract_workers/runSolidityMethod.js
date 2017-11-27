const Web3 = require('web3');
const {events} = require('./../types');
const {execFuncByName} = require('./../utils');
/**
 * worker for contract.runSolidityMethod
 * @param{Object} options - options to instantiate web3 and testContract
 */
function runSolidityMethod(options) {
  const web3 = new Web3(new Web3.providers.HttpProvider(options.provider));
  let testContract = web3.eth.contract(options.abi)
    .at(options.address);
  let result;
  if (options.args !== null && options.args !== undefined) {
    console.log("did that really just work");
    console.log(testContract['get'](...options.args));
    result = testContract['get'](...options.args);
  } else {
    result = testContract['get']();
  }
  // let result = execFuncByName(options.name, testContract, options.args);
  process.send(result);
}

// the arguments we get as a message from parent process
process.on(events.message, (msg) => {
  runSolidityMethod(JSON.parse(msg));
});
