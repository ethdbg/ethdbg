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
  constructor(options) {
    options.loggerLevel = options.ethdbg.loggerLevel;
    super(options);
  }
  
  /**
   * starts the debugger and initializes all the events
   * writes `events.ready` to stdout when TestRPC is up, however, not yet in
   * 'debug' mode (will not scan/check for breakpoints, etc)
   */
  run() {
    ethdbg.start();
    process.stdin.on('data', this.dataIn);
    this.on(events.ready, () => {
      process.stdout.write(events.ready);
    });
    return this;
  }

  dataIn(data) {

    /**
     * returns deserialized data + event
     * @return{Object}
     */
    function serialize(data) {
    
    }
    
    /**
     * serializes data + event
     */
    function deserialize(ev, data) {
    
    }
  }
}
