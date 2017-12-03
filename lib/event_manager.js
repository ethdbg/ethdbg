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

/**
 * Event manager
 * Enables registering, unregistering, and triggering of events
 *
 */
class EventManager {
  constructor() {
    this.registered = {};
    this.anonymous = {};
  }

  /**
  * Unregister a listener.
  * Note that if obj is a function,
  * the unregistration will be applied to the dummy obj {}.
  * @param {string} eventName - the event name
  * @param {Object|Function} obj - object that will listen on this event
  * @param {Function} func - function of the listenners that will be executed
  * @public
  */
  unregister(eventName, obj, func) {
    if (!this.registered[eventName]) {
      return;
    }
    if (obj instanceof Function) {
      func = obj;
      obj = this.anonymous;
    }
    for (let reg in this.registered[eventName]) {
      if (this.registered[eventName][reg].obj === obj &&
        this.registered[eventName][reg].func === func
      ) {
        this.registered[eventName].splice(reg, 1);
      }
    }
  }

  /**
   * Register a new listenner.
   * Note that if obj is a function,
   * the function registration will be associated with the dummy object {}
   *
   * @param {String} eventName - the event name
   * @param {Object|Function} obj - object that will listen on this event
   * @param {Function} func - function of the listenners that will be executed
  */
  register(eventName, obj, func) {
    if (!this.registered[eventName]) {
      this.registered[eventName] = [];
    }
    if (obj instanceof Function) {
      func = obj;
      obj = this.anonymous;
    }
    this.registered[eventName].push({
      obj: obj,
      func: func,
    });
  }

  /**
  * trigger event.
  * Every listenner have their associated function executed
  *
  * @param {String} eventName  - the event name
  * @param {Array} args - argument that will be passed to the exectued function.
  */
  trigger(eventName, args) {
    if (!this.registered[eventName]) {
      return;
    }
    for (let listener in this.registered[eventName]) {
      let l = this.registered[eventName][listener];
      l.func.apply(l.obj === this.anonymous ? {} : l.obj, args);
    }
  }
}

module.exports = {
  ethdbgEv,
  EventManager,
};

