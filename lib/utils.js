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

function execFuncByName(functionName, context, ...args) {
    let namespaces = functionName.split('.');
    let func = namespaces.pop();
    for (let i = 0; i < namespaces.length; i++) {
        context = context[namespaces[i]];
    }
    return context[func](...args);
}

module.exports = {
  waitForEventWithTimeout,
  execFuncByName,
};
