const Debugger = require('./debugger');
const events = require('./types').ethdbgEvents;

// TODO possibly move serialize/deserialize into utils
/**
 * for use in communicating with the debugger through FIFO/pipes
 * first 32 bytes of every stdin/stdout message will be the event that is passed
 * if the event is < 32 bytes/chars, it shall be padded with 0
 * as a result, 0 cannot be used in any event name, or anywhere else in the 32
 * bytes save as padding towards the end of the event
 * anything after the event name must be a string. (use JSON.stringify()) for JS
 * Objects.
 * EX:
 * `Debugger:AddFiles000000000000000{contractFilesToDebug['file1','file2','file3']`}
 * `VM:Debugger:breakpoint0000000000{breakpoint: 24}`
 * possible events are available in ethdbg/types/events. It is recommended
 * to import this file to have access to the event types instead of manually
 * entering them.
 * @param{Object} options - debug options
 */
class DebugProvider extends Debugger {
  constructor(options) { //eslint-disable-line require-jsdoc
    options.loggerLevel = options.ethdbg.loggerLevel;
    super(options);

    // output events
    this.on(events.hitBreakpoint, (evObj) => {
      process.stdout.write(this.serialize(events.hitBreakpoint, evObj));
    });
  }

  /**
   * starts the debugger and initializes all the events
   * writes `events.ready` to stdout when TestRPC is up, however, not yet in
   * 'debug' mode (will not scan/check for breakpoints, etc)
   * @return {DebugProvider}
   */
  run() {
    this.start();
    process.stdin.on('data', this.dataIn);
    this.on(events.ready, () => {
      process.stdout.write(events.ready);
    });
    return this;
  }

  /**
   * Deserializes Data received, and then emits events depending on that data
   * @param{string} data
   */
  dataIn(data) {
    this.emit(...deserialize(data));

    /**
     * serializes data + event
     * @param{string} data -
     * @return{Array}
     */
    function deserialize(data) {
      const event = trimZeros(data.substr(0, 32));
      const input = JSON.parse(data.substr(33));

      /** trims _all_ zeros from a string
       * @param{string} str - string to trim zeros from
       * @param{number} len - length of string
       * @return{string} - trim without leading zeros
      */
      function trimZeros(str) {
        return str.replace(/[0]+|[0]+$/g, '');
      }
      return [event, input];
    }
  }

  /**
   * returns deserialized data + event
   * @param{string} ev
   * @param{Object} data
   * @return{string}
   */
  serialize(ev, data) {
    if (ev.length > 32) throw new Error('Event name too long');
    return ev.padEnd(32, '0').concat(JSON.stringify(data));
  }
}

module.exports = DebugProvider;
exports.default = DebugProvider;
