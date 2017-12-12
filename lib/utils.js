/**
 * waits for an event with a timeout attached
 * @param{EventEmitter} socket - event emmitter ev is attached to
 * @param{string} ev - event to wait for
 * @param{number} t - timeout to wait before throwing error
 * @param{err} err - an optional error message if event times out
 * @return{Promise}
 */
function waitForEventWithTimeout(socket, ev, t, err) {
  return new Promise(function(resolve, reject) {
    let err;
    if (err === undefined) {
      err = `Event ${ev} timed out ${err}`;
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
 * waits for an event indefinitely
 * @param{EventEmitter} socket - event emmitter ev is attached to
 * @param{string} ev - event to wait for
 * @param{err} err - an optional error message
 * @return{Promise}
 */
function waitForEventIndefinitely(socket, ev, err) {
  return new Promise(function(resolve, reject) {
    let err;
    if (err === undefined) {
      err = `Event ${ev} timed out ${err}`;
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
 * checks if a variable is neither null or undefined
 * @param{any} v - some variable
 * @return{boolean} true if not null or undefined, false otherwise
 */
function isDef(v) {
  if (v !== null && v !== undefined) return true;
  else return false;
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
  waitForEventIndefinitely,
  sleep,
  waitBlock,
  isDef,
};
