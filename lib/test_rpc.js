#! /usr/bin/env node

const Contract = require('./contract');
const SourceMap = require('./source_map');
const Logger = require('./logger');
const {
  ForkOptions,
  events,
} = require('./types');
const EventManager = require('./event_manager');

/**
 * Interact with a TestRPC object
 * @author Andrew Plaza <aplaza@liquidthink.net>
 * @param {Logger} logger - logger class for debug/general output
 * @param {SourceMap} sourceMap - SourceMap class for mapping bytecode to src
 * @param {Object} options - option for testRPC
 * @private
 */
class TestRPC {
  constructor(logger, sourceMap, options) {
    this.options = {};
    _.merge(this.options, ForkOptions, options);
    this.hostAddress = null;
    this.forkAddress = null;
    this.logger = logger;
    this.sourceMap = sourceMap;
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
