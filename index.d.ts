import {EventEmitter} from 'events';

declare namespace ethdbg {
  interface Debugger implements EventEmitter {

    constructor(options: Object);

    add(options: Object): Debugger;

    start(): Promise<Debugger>;

    toggleBreakpoint(fp: string, ln: number): Debugger;
    
    addBreakpoints(Array<Array>): Debugger;
    
    removeBreakpoints(Array<Array>): Debugger;

    stepInto(): Debugger;

    next(): Debugger;

    events(): void;

    trackCode(addr: string): Promise<boolean> | Promise<Contract>;
    
    doSomethingIntensive(): void;
  }

  interface DebugProvider implements Debugger {
    
    constructor(options: Object);
    
    run(): DebugProvider;
    
    dataIn(data: string): void;
    
    serialize(ev: string, data: Object): string;
  }

  interface types {
    interface events {
      isReady:            'isReady',
      ready:              'ready',
      hitBreakpoint:      'hitBreakpoint',
      addBreakpoints:     'addBreakpoints',
      removeBreakpoints:  'removeBreakpoints',
      clearAllBreakpoints:'clearAllBreakpoints',
      toggleBreakpoint:   'toggleBreakpoint',
      addFiles:           'addFiles',
      start:              'start',
      stop:               'stop',
      continue:           'continueExecution',
      stepInto:           'stepInto',
      stepOver:           'stepOver',
      getVarList:         'getVarList',
      restart:            'restart',
      kill:               'EXECUTE_ORDER_66',
      message:            'message',
    }
  }
}
