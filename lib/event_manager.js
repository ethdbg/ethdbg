const EventEmitter = require('events');
const ethdbgEv = new EventEmitter();
const clc = require('cli-color');
const die = clc.red.bold.bgWhite;

/**
 * A unified event bus
 * Global events & errors go here
 */
ethdbgEv.on('uncaughtException', (err) => {
  throw new Error(`Uncaught Exception!: ${err}`, err);
});


// Global Unhandled Promise Rejection Error Handler, for uncaught errors
process.on('unhandledRejection', (error) => {
  console.log(die('Unhandled Rejection Error in Eth Debug: '), error.message);
  console.log(error);
});


module.exports = ethdbgEv;

