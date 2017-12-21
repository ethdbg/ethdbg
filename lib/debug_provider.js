const Debugger = require('./debugger.js');
const {events} = require('./types');
const {
  isDef,
  serialize,
} = require('./utils');


// TODO possibly move deserialize into utils
// filter out testRPC/ethdbg options better
/**
 * for use in communicating with the debugger through FIFO/pipes
 * (like in VSCode, for example)
 * first 32 bytes of every stdin/stdout message will be the event that is passed
 * if the event is < 32 bytes/chars, it shall be padded with 0.
 * as a result, 0 cannot be used in any event name, as all 0's will be trimmed.
 * anything after the event name + padding (32bytes) must be a string.
 * (use JSON.stringify()) for JS Objects.
 * possible events are available in ethdbg/types/events. It is recommended
 * to import this file to have access to the event types instead of manually
 * entering them.
 * loggerProviderMode option defaults to true
 * @example
 * `Debugger:AddFiles000000000000000{contractFilesToDebug['file1','file2','file3']`}
 * `VM:Debugger:breakpoint0000000000{breakpoint: 24}`
 * or more programatically
 * ```
 * const events = require('ethdbg').types.ethdbgEvents;
 * const sendData =  events.padEnd(32, '0').concat(JSON.stringify({hello: 'helloworld', breakpoints: [...]});
 * ```
 * @param{Object} options - debug options
 * @public
 */
class DebugProvider extends Debugger {
  constructor(options) { // eslint-disable-line require-jsdoc
    if (isDef(options.loggerLevel) && !isDef(options.ethdbg)) {
      options.ethdbg = {
        loggerLevel: options.loggerLevel,
        loggerProviderMode:
          isDef(options.loggerProviderMode) ? options.loggerProviderMode : true,
      };
    } else if (isDef(options.ethdbg)) {
      options.ethdbg = {
        loggerLevel: options.ethdbg.loggerLevel,
        loggerProviderMode:
          (isDef(options.ethdbg.loggerProviderMode) ?
            options.ethdbg.loggerProviderMode : true),
      }
    }
    options.testRPC = options;
    super(options);

    this.ready = false;

    // ========= EVENTS =========
    // ping-pong events
    this.on(events.isReady, () => {
      if (this.ready) process.stdout.write('1');
      else process.stdout.write('0');
    });
    this.on(events.ready, () => {
      this.writeEvent(events.ready, null);
    });
    // output events
    this.on(events.hitBreakpoint, (evObj) => {
      process.stdout.write(serialize(events.hitBreakpoint, evObj));
    });
  }

  /**
   * starts the debugger and initializes all the events
   * writes `events.ready` to stdout when TestRPC is up, however, not yet in
   * 'debug' mode (will not scan/check for breakpoints, etc)
   * @return {DebugProvider}
   * @public
   */
  run() {
    this.start();
    process.stdin.on('data', this.dataIn);
    this.on(events.ready, () => {
      this.ready = true;
    });
    return this;
  }

  /**
   * write an event to the output stream
   * @param{string} ev - events from `event` type
   * @param{Object} obj - Object to give as data
   */
  writeEvent(ev, obj) {
    // provides a buffer, in case stream is ready byline
    process.stdout.write(serialize(ev, obj));
    process.stdout.write('\n');
  }

  /**
   * Deserializes Data received, and then emits events depending on that data
   * @param{string} data
   * @public
   */
  dataIn(data) {
    this.logger.debug('Deserializing: ' + data);
    this.emit(...deserialize(data));
    this.logger.debug('emitting: ${...deserialize(data)}');

    /**
     * deserializes data + event
     * @param{string} data -
     * @return{Array}
     */
    function deserialize(data) {
      if (data instanceof Buffer) data = data.toString();
      else if (typeof data != 'string') {
        throw new Error(
          'Cannot deserialize data which is not a string or buffer'
        );
      }

      const event = trimZeros(data.substr(0, 32));
      const input = data.length > 32 ? JSON.parse(data.substr(32)) : null;

      /** trims _all_ zeros from a string
       * @param{string} str - string to trim zeros from
       * @return{string} - trim without leading zeros
      */
      function trimZeros(str) {
        return str.replace(/[0]+|[0]+$/g, '');
      }
      return [event, input];
    }
  }
}
module.exports = DebugProvider;
