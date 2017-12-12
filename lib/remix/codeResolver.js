'use strict'
var codeUtils = require('./../util/codeUtils');

// TODO convert to ES6 class
module.exports = {
  bytecodeByAddress: {}, // bytes code by contract addesses
  instructionsByAddress: {}, // assembly items instructions list by contract addesses
  instructionsIndexByBytesOffset: {}, // mapping between bytes offset and instructions index.

  clear: function () {
    this.bytecodeByAddress = {}
    this.instructionsByAddress = {}
    this.instructionsIndexByBytesOffset = {}
  },
  
  /**
   * @param{address} - address of code to resolve
   * @param{hexCode|undefined|null} - hexCode to cache if doing so
   */
  resolveCode: function (address, hexCode) {
    var cache = this.getExecutingCodeFromCache(address)
    if (cache) {
      return {address, cache}
    }
    return this.cacheExecutingCode(address, hexCode);
    
  },

  cacheExecutingCode: function (address, hexCode) {
    var codes = this.formatCode(hexCode)
    this.bytecodeByAddress[address] = hexCode
    this.instructionsByAddress[address] = codes.code
    this.instructionsIndexByBytesOffset[address] = codes.instructionsIndexByBytesOffset
    return this.getExecutingCodeFromCache(address)
  },

  formatCode: function (hexCode) {
    var code = codeUtils.nameOpCodes(new Buffer(hexCode.substring(2), 'hex'))
    return {
      code: code[0],
      instructionsIndexByBytesOffset: code[1]
    }
  },

  getExecutingCodeFromCache: function (address, hexCode) {
    if (this.instructionsByAddress[address]) {
      return {
        instructions: this.instructionsByAddress[address],
        instructionsIndexByBytesOffset: this.instructionsIndexByBytesOffset[address],
        bytecode: this.bytecodeByAddress[address]
      }
    } else {
      this.cacheExecutingCode(address, hexCode)
      return {
        instructions: this.instructionsByAddress[address],
        instructionsIndexByBytesOffset: this.instructionsIndexByBytesOffset[address],
        bytecode: this.bytecodeByAddress[address]
      };
    }
  },

  getInstructionIndex: function (address, pc, hexCode) {
    return this.getExecutingCodeFromCache(address, hexCode).instructionsIndexByBytesOffset[pc]
  }
}
