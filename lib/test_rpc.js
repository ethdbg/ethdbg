#! /usr/bin/env node
const {events} = require('./types');
const EventManager = require('./event_manager').ethdbgEv;

/**
 * Interact with a TestRPC object
 * Default methods for testRPC
 * @author Andrew Plaza <aplaza@liquidthink.net>
 * @param {Logger} logger - logger class for debug/general output
 * @param {Object} options - option for testRPC
 * @private
 */
class TestRPC {
  constructor(logger) {
    this.logger = logger;
    this.server = null;
    this.hostAddress = null;
    this.forkAddress = null;
  }

  /**
   * should initialize Ethereum RPC server
   */
  init() {}

  /**
   * kills the testRPC with a code of 0
   */
  kill() {
    process.exit(0);
  }
  /**
   * Sets up listeners for forked testRPC
   * @private
   */
  initEvents() {
    EventManager.on(events.testRPCBreakpoint, () => {
      // pause execution...
      // hand over context info (code, locals, etc) to the debugger
    });
  }
}

module.exports = TestRPC;
