'use strict';

const Debugger = require('./lib/debugger.js');
const DebugProvider = require('./lib/debug_provider.js');
const events = require('./lib/types.js').events;
const err = require('./lib/err.js');

module.exports = {
  Debugger,
  DebugProvider,
  events,
  err,
};
exports.default = Debugger;
exports.DebugProvider = DebugProvider;
exports.events = events;
