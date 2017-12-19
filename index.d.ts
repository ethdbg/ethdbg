import {EventEmitter} from 'events';
import {Debugger} from './lib/debugger';
import {DebugProvider} from './lib/debug_provider';
import {events} from './lib/types';

declare namespace ethdbg {
  class Debugger {

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

  class DebugProvider {
    
    constructor(options: Object);
    
    run(): DebugProvider;
    
    dataIn(data: string): void;
    
    serialize(ev: string, data: Object): string;
  }
  
  events: Object;
}

export = {
  ethdbg
};
