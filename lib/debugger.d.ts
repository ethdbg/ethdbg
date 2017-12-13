export default class Debugger {

  constructor(options: Object);

  getContext(): Object;

  add(options: Object): Debugger;

  async start(): Promise<Debugger>;

  toggleBreakpoint(name: string, lineNumber: number): Debugger;

  stepInto(): Debugger;

  next(): Debugger;

  async hitBreakpoint(evObj: Object): Promise<Debugger>;

  events(): void;

  async trackCode(addr: string): Promise<boolean> | Promise<Contract>;

}
