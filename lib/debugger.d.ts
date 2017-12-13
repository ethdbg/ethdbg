export default class Debugger {

    constructor(options: Object): void;

    getContext(): Object;

    add(options: Object): Debugger;

    async start(): Debugger;

    toggleBreakpoint(name: string, lineNumber: number): Debugger;

    stepInto(): Debugger;

    next(): Debugger;

    async hitBreakpoint(evObj: Object): void;

    events(): void;

    async trackCode(addr: string): boolean | Contract | undefined;

}