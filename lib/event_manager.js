const EventEmitter = require('events');
const ethdbgEv = new EventEmitter();

/**
 * A unified event bus
 * standard event names: <Class>:<Event>
 * where Class is the classname (in all lowercase) and Event is the event
 * also in all lowercase.
 *
 */
ethdbgEv.on('uncaughtException', (err) => {
  throw new Error(`Uncaught Exception!: ${err}`, err);
});

module.exports = ethdbgEv;
