import Contract from './contract';
import Context from './context';

export default class Debugger {

  constructor(options: Object);

  getContext(): Context;

  add(options: Object): Debugger;

  start(): Promise<Debugger>;

  toggleBreakpoint(name: string, lineNumber: number): Debugger;

  stepInto(): Debugger;

  next(): Debugger;

  hitBreakpoint(evObj: Object): Promise<Debugger>;

  events(): void;

  trackCode(addr: string): Promise<boolean> | Promise<Contract>;

}
