// TODO: should be moved into a class with EventManager
/**
 * waits for an event with a timeout attached
 * @param{EventEmitter} socket - event emmitter ev is attached to
 * @param{string} ev - event to wait for
 * @param{number} t - timeout to wait before throwing error
 * @param{err} err - an optional error message if event times out
 */
function waitForEventWithTimeout(socket, ev, t, err) {
  return new Promise(function(resolve, reject) {
    if (err === undefined) {
      let err = `Event ${ev} timed out`;
    }
    let timer;

    /**
     * callback for event
     * @param{Object} data - data passed to event
     */
    function listener(data) {
      clearTimeout(timer);
      socket.removeListener(ev, listener);
      resolve(data);
    }
    socket.on(ev, listener);
    timer = setTimeout(function() {
      socket.removeListener(ev, listener);
      reject(new Error(err));
    }, t);
  });
}

/**
 * a simple sleep function
 * @param{number} ms - time in milli-seconds to sleep for
 * @return{Promise}
 * @example
 * await sleep(4000); to wait 4 seconds
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Wait for a transaction to be mined
 * @param{Web3} web3 - web3 instance
 * @param{number} txHash - transactionHash waiting to be mined
 * @param{Logger} logger - logger object for debugging, errors, etc
 * @return{Object}
 */
async function waitBlock(web3, txHash, logger) {
  let receipt;
  let i = 0;
  while (i < 4) {
    receipt = web3.eth.getTransactionReceipt(txHash);
    if (receipt && receipt.contractAddress) {
      logger.debug(`Contract is deployed at ${receipt.contractAddress}`);
      break;
    } else {
      logger.debug('waiting for contract to be mined...');
      await sleep(500);
      i++;
    }
  }
  if (receipt === null || receipt === undefined) {
    throw new Error('Transaction timed out');
  }
  return receipt;
}

module.exports = {
  waitForEventWithTimeout,
  sleep,
  waitBlock,
};
