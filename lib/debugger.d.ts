export default class Debugger {

  constructor(options: Object);

  getContext(): Object;

  add(options: Object): Debugger;

  start(): Promise<Debugger>;

  toggleBreakpoint(name: string, lineNumber: number): Debugger;

  stepInto(): Debugger;

  next(): Debugger;

  hitBreakpoint(evObj: Object): Promise<Debugger>;

  events(): void;

  trackCode(addr: string): Promise<boolean> | Promise<Contract>;

}
