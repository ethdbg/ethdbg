'use strict';

const Debugger = require('./lib/debugger');
const DebugProvider = require('./lib/debug_provider');
const events = require('./lib/types').events;
const err = require('./lib/err');

module.exports = {
  Debugger,
  DebugProvider,
  events,
  err,
};
exports.default = Debugger;
exports.DebugProvider = DebugProvider;
exports.events = events;
