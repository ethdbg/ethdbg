import {EventEmitter} from 'events';
import {Debugger} from './lib/debugger';
import {DebugProvider} from './lib/debug_provider';
import {events} from './lib/types';

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
  
  events: Object;
}
declare var Debugger: ethdbg.Debugger;
declare var DebugProvider: ethdbg.DebugProvider;
declare var events: ethdbg.events;

export = {
  Debugger,
  DebugProvider,
  events,
};
