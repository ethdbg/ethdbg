var remixLib = require('remix-lib')
var EventManager = remixLib.EventManager
var traceHelper = remixLib.helpers.trace
var SourceMappingDecoder = remixLib.SourceMappingDecoder
var codeResolver = require('./codeResolver')
// TODO: convert to ES6 class
/*
  resolve contract code referenced by vmtrace in order to be used by asm listview.
  events:
   - changed: triggered when an item is selected
   - resolvingStep: when CodeManager resolves code/selected instruction of a new step
*/

function CodeManager () {
  this.event = new EventManager()
  this.isLoading = false
  this.codeResolver = codeResolver
}

/**
 * clear the cache
 *
 */
CodeManager.prototype.clear = function () {
  this.codeResolver.clear()
}

/**
 * resolve the code of the given @arg stepIndex and trigger appropriate event
 *
 * @param {String} stepIndex - vm trace step
 * @param {Object} tx - transaction (given by web3)
 * @param {String} calledAddr - address that is executing code
 */
CodeManager.prototype.resolveStep = function (stepIndex, tx, calledAddr) {
  if (stepIndex < 0) return
  this.event.trigger('resolvingStep')
  var self = this
  if (stepIndex === 0) {
    retrieveCodeAndTrigger(self, tx.to, stepIndex, tx)
  } else {
    retrieveCodeAndTrigger(self, calledAddr, stepIndex, tx)
  }
}

/**
 * Retrieve and caches code located at the given @arg address
 *
 * @param {String} address - address of the contract to get the code from
 * @param {String} hexCode of contract
 * @param {Function} cb - callback function, return the bytecode
 */
CodeManager.prototype.getCode = function (address, hexCode, cb) {
  if (traceHelper.isContractCreation(address)) {
    var codes = codeResolver.getExecutingCodeFromCache(address)
    if (!codes) {
      codes = codeResolver.cacheExecutingCode(address, hexCode)
      cb(null, codes)
    } else {
      cb(null, codes)
    }
  } else {
    codeResolver.resolveCode(address, function (address, code) {
      cb(null, code)
    })
  }
}

/**
 * Retrieve the called function for the current vm step for the given
 * @arg address
 *
 * @param {String} stepIndex - vm trace step
 * @param {String} sourceMap - source map given byt the compilation result
 * @param {Object} ast - ast given by the compilation result
 * @param {String} addr - address of current called address
 * @param {Number} pc -  program counter of current step
 * @return {Object} return the ast node of the function
 */
CodeManager.prototype.getFunctionFromStep =
  function(stepIndex, sourceMap, ast, addr, pc) {
    return this.getFunctionFromPC(addr, pc, sourceMap, ast);
}

/**
 * Retrieve the instruction index of the given @arg step
 *
 * @param {String} address - address of the current context
 * @param {String} step - vm trace step
 * @param {Function} callback - instruction index
 */
CodeManager.prototype.getInstructionIndex = function(address, pc, hexCode) {
  return codeResolver.getInstructionIndex(address, pc, hexCode);
}

/**
 * Retrieve the called function for the given @arg pc and @arg address
 *
 * @param {String} address - address of the current context (used to resolve instruction index)
 * @param {String} pc - pc that point to the instruction index
 * @param {String} sourceMap - source map given byt the compilation result
 * @param {Object} ast - ast given by the compilation result
 * @return {Object} return the ast node of the function
 */
CodeManager.prototype.getFunctionFromPC = function(address, pc, sourceMap, ast) {
  var instIndex = codeResolver.getInstructionIndex(address, pc)
  return SourceMappingDecoder
    .findNodeAtInstructionIndex('FunctionDefinition', instIndex, sourceMap, ast);
}

/**
 * CM - codeManager
 * @private
 */
function retrieveCodeAndTrigger (CM, address, stepIndex, tx) {
  CM.getCode(address, function (error, result) {
    if (!error) {
      retrieveIndexAndTrigger(CM, address, stepIndex, result.instructions)
    } else {
      console.log(error)
    }
  })
}

/**
 * CM - codeManager
 */
function retrieveIndexAndTrigger(CM, address, step, code) {
  CM.getInstructionIndex(address, step, function(error, result) {
    if (!error) {
      CM.event.trigger('changed', [code, address, result])
    } else {
      console.log(error)
    }
  })
}

module.exports = CodeManager
