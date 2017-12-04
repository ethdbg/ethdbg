const TraceAnalyser = require('./traceAnalyser');
const TraceRetriever = require('./traceRetriever');
const TraceCache = require('./traceCache');
const TraceStepManager = require('./traceStepManager');
const traceHelper = require('./traceHelper');
const util = require('../../util/util');
const globalUtil = require('../global');
const {chckVar} = require('../../utils');

//TODO: Document this code (ethdbg)
class TraceManager {
  constructor() {
    this.isLoading = false;
    this.trace = null;
    this.traceCache = new TraceCache();
    this.traceAnalyser = new TraceAnalyser(this.traceCache);
    this.traceRetriever = new TraceRetriever();
    this.traceStepManager = new TraceStepManager(this.traceAnalyser);
    this.tx;
  }

  /** init section */
  resolveTrace(tx, callback) {
    if(!chckVar(tx)) throw new Error('tx is undefined or null');
    this.tx = tx;
    this.init();
    if (!globalUtil.web3) callback('web3 not loaded', false);
    this.isLoading = true;
    let self = this;
    this.traceRetriever.getTrace(tx.hash, function(error, result) {
      if (error) {
        console.log(error)
        self.isLoading = false;
        callback(error, false);
      } else {
        if (result.structLogs.length > 0) {
          self.trace = result.structLogs;
          self.traceAnalyser.analyse(
            result.structLogs, tx, function(error, result) {
              if (error) {
                self.isLoading = false;
                console.log(error);
                callback(error, false);
              } else {
                self.isLoading = false;
                callback(null, true);
              }
            })
        } else {
          let mes =
            tx.hash + ' is not a contract invokation or contract creation.';
          console.log(mes);
          self.isLoading = false;
          callback(mes, false);
        }
      }
    });
  }

  /**
   *
   */
  init() {
    this.trace = null;
    this.traceCache.init();
  }
  // API section
  inRange(step) {
    return this.isLoaded() && step >= 0 && step < this.trace.length
  }

  isLoaded() {
    return !this.isLoading && this.trace !== null;
  }

  getLength(callback) {
    if (!this.trace) {
      callback('no trace available', null);
    } else {
      callback(null, this.trace.length);
    }
  }

  accumulateStorageChanges(index, address, storageOrigin, callback) {
    let storage = this.traceCache.accumulateStorageChanges(
      index, address, storageOrigin
    );
    callback(null, storage);
  }

  getAddresses(callback) {
    callback(null, this.traceCache.addresses)
  }

  getCallDataAt(stepIndex, callback) {
    let check = this.checkRequestedStep(stepIndex);
    if (check) {
      return callback(check, null);
    }
    let callDataChange = util.
      findLowerBoundValue(stepIndex, this.traceCache.callDataChanges);
    if (callDataChange === null) return callback('no calldata found', null);
    callback(null, [this.traceCache.callsData[callDataChange]]);
  }

  buildCallPath(stepIndex, callback) {
    let check = this.checkRequestedStep(stepIndex);
    if (check) {
      return callback(check, null);
    }
    let callsPath = 
      util.buildCallPath(stepIndex, this.traceCache.callsTree.call);
    if (callsPath === null) return callback('no call path built', null);
    callback(null, callsPath);
  }

  getCallStackAt(stepIndex, callback) {
    let check = this.checkRequestedStep(stepIndex);
    if (check) {
      return callback(check, null);
    }
    let call = util.findCall(stepIndex, this.traceCache.callsTree.call);
    if (call === null) return callback('no callstack found', null);
    callback(null, call.callStack);
  }

  getStackAt(stepIndex, callback) {
    let check = this.checkRequestedStep(stepIndex);
    if (check) {
      return callback(check, null);
    }
    let stack;
    if (this.trace[stepIndex].stack) { // there's always a stack
      stack = this.trace[stepIndex].stack.slice(0);
      stack.reverse();
      callback(null, stack);
    } else {
      callback('no stack found', null);
    }
  }

  getLastCallChangeSince(stepIndex, callback) {
    let check = this.checkRequestedStep(stepIndex);
    if (check) {
      return callback(check, null);
    }
    let callChange = util.findCall(stepIndex, this.traceCache.callsTree.call);
    if (callChange === null) {
      callback(null, 0);
    } else {
      callback(null, callChange);
    }
  }

  getCurrentCalledAddressAt(stepIndex, callback) {
    let check = this.checkRequestedStep(stepIndex);
    if (check) {
      return callback(check, null);
    }
    this.getLastCallChangeSince(stepIndex, function (error, resp) {
      if (error) {
        callback(error, null);
      } else {
        if (resp) {
          callback(null, resp.address);
        } else {
          callback('unable to get current called address. '
            + stepIndex +
            ' does not match with a CALL'
          );
        }
      }
    });
  }

  getContractCreationCode(token, callback) {
    if (this.traceCache.contractCreation[token]) {
      callback(null, this.traceCache.contractCreation[token]);
    } else {
      callback('no contract creation named ' + token, null);
    }
  }

  getMemoryAt(stepIndex, callback) {
    let check = this.checkRequestedStep(stepIndex);
    if (check) {
      return callback(check, null);
    }
    let lastChanges = util.
      findLowerBoundValue(stepIndex, this.traceCache.memoryChanges);
    if (lastChanges === null) return callback('no memory found', null);
    callback(null, this.trace[lastChanges].memory);
  }

  getCurrentPC(stepIndex, callback) {
    let check = this.checkRequestedStep(stepIndex);
    if (check) {
      return callback(check, null);
    }
    callback(null, this.trace[stepIndex].pc);
  }

  getReturnValue(stepIndex, callback) {
    let check = this.checkRequestedStep(stepIndex);
    if (check) {
      return callback(check, null);
    }
    if (!this.traceCache.returnValues[stepIndex]) {
      callback('current step is not a return step');
    } else {
      callback(null, this.traceCache.returnValues[stepIndex]);
    }
  }

  getCurrentStep(stepIndex, callback) {
    let check = this.checkRequestedStep(stepIndex);
    if (check) {
      return callback(check, null);
    }
    callback(null, this.traceCache.steps[stepIndex]);
  }

  getMemExpand(stepIndex, callback) {
    let check = this.checkRequestedStep(stepIndex);
    if (check) {
      return callback(check, null);
    }
    callback(null,
      this.trace[stepIndex].memexpand ? this.trace[stepIndex].memexpand : '');
  }

  getStepCost(stepIndex, callback) {
    let check = this.checkRequestedStep(stepIndex);
    if (check) {
      return callback(check, null);
    }
    callback(null, this.trace[stepIndex].gasCost);
  }

  getRemainingGas(stepIndex, callback) {
    let check = this.checkRequestedStep(stepIndex);
    if (check) {
      return callback(check, null);
    }
    callback(null, this.trace[stepIndex].gas);
  }

  isCreationStep(stepIndex) {
    return traceHelper.isCreateInstruction(this.trace[stepIndex]);
  }

  // step section
  findStepOverBack(currentStep) {
    return this.traceStepManager.findStepOverBack(currentStep);
  }

  findStepOverForward(currentStep) {
    return this.traceStepManager.findStepOverForward(currentStep);
  }

  findNextCall(currentStep) {
    return this.traceStepManager.findNextCall(currentStep);
  }

  findStepOut(currentStep) {
    return this.traceStepManager.findStepOut(currentStep);
  }

  // util
  checkRequestedStep(stepIndex) {
    if (!this.trace) {
      return 'trace not loaded';
    } else if (stepIndex >= this.trace.length) {
      return 'trace smaller than requested';
    }
    return undefined;
  }

  waterfall(calls, stepindex, cb) {
    let ret = [];
    let retError = null;
    for (let call in calls) {
      calls[call].apply(this, [stepindex, function(error, result) {
        retError = error;
        ret.push({error: error, value: result});
      }]);
    }
    cb(retError, ret);
  }
}

module.exports = TraceManager;


