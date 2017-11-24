const EventEmitter = require('events');
const ethdbgEv = new EventEmitter();
const clc = require('cli-color');
const die = clc.red.bold.blink.bgWhite;

/**
 * A unified event bus
 * Global events & errors go here
 * standard event names used elsewhere: <Class>:<Event>
 * where Class is the classname (in all lowercase) and Event is the event
 * also in all lowercase.
 */
ethdbgEv.on('uncaughtException', (err) => {
  throw new Error(`Uncaught Exception!: ${err}`, err);
});

// Global Unhandled Promise Rejection Error Handler, for uncaught errors
process.on('unhandledRejection', error => {
  console.log(die('Unhandled Rejection Error in Eth Debug: '), error.message);
  console.log(error);
});

/** Const Error Declarations */
const eventTypes = {
  forkReady: 'fork:ready',
};

module.exports = {
  ethdbgEv,
  eventTypes,
}
