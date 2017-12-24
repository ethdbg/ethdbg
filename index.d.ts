import { EventEmitter } from 'events';

declare namespace ethdbg {
  export interface Debugger {

    constructor(options: Object);

    add(options: Object): Debugger;

    start(): Promise<Debugger>;

    toggleBreakpoint(fp: string, ln: number): Debugger;

    addBreakpoints(breakpoints: Array<Map<number, string>>): Debugger;

    removeBreakpoints(breakpoints: Array<Map<number, string>>): Debugger;

    stepInto(): Debugger;

    next(): Debugger;

    events(): void;

    trackCode(addr: string): Promise<boolean> | Promise<any>;

    doSomethingIntensive(): void;
  }

  export interface DebugProvider {

    constructor(options: Object);

    run(): DebugProvider;

    dataIn(data: string): void;

    serialize(ev: string, data: Object): string;
  }

  export enum events {
    isReady = 'isReady',
    ready = 'ready',
    hitBreakpoint = 'hitBreakpoint',
    addBreakpoints = 'addBreakpoints',
    removeBreakpoints = 'removeBreakpoints',
    clearAllBreakpoints = 'clearAllBreakpoints',
    toggleBreakpoint = 'toggleBreakpoint',
    addFiles = 'addFiles',
    start = 'start',
    stop = 'stop',
    continue = 'continueExecution',
    stepInto = 'stepInto',
    stepOut = 'stepOut',
    stepOver = 'stepOver',
    getVarList = 'getVarList',
    restart = 'restart',
    kill = 'EXECUTE_ORDER_66',
    message = 'message',
  }
}

declare var Debugger: ethdbg.Debugger;
declare var DebugProvider: ethdbg.DebugProvider;
declare var events: ethdbg.events;

export {
  Debugger,
  DebugProvider,
  events,
};
