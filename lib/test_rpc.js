#! /usr/bin/env node
const Contract = require('./contract');
const SourceMap = require('./source_map');
const Logger = require('./logger');
const {Simple, events} = require('./types');
const EventManager = require('./event_manager');

/**
 * Interact with a TestRPC object
 * @author Andrew Plaza <aplaza@liquidthink.net>
 * @param {Logger} logger - logger class
 * @private
 */
class TestRPC {
  constructor(logger, sourceMap) {
    this.logger = logger;
    this.sourceMap = sourceMap;
  }

  /**
   * Sets up listeners for forked testRPC
   * @private
   */
  initEvents() {
    EventManager.on('breakpoint', () => {
        // pause execution...
        // hand over context info (code, locals, etc) to the debugger
    });
  }

  /**
   * Runs the contract that is being debugged
   * @param {Contract} contract - Contract object
   * @param {Function} cb - called once the contract is deployed
   * @private
   */
  runContract(contract, cb) {
    EventManager.on('fork:ready', () => {
      // once the forked blockchain is ready to be deployed to, deploy contract
      // TODO: Should be made with promises or async/await (async/await pref)
      let _contract = new Contract(this.forkAddress,
        contract.getPath(),
        contract.getName(),
        this.logger
      );
      _contract.deploy();
      -contract.test((c, cb) => {
        let result = c.get();
        this.logger.debug('Result');
        this.logger.debug(result);
        cb();
      });
    });
  }
}

module.exports = TestRPC;

