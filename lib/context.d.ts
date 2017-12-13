export interface stackframe {
	text: string;
	file: string;
	line: number;
}

export interface variable {
	name: string;
	value: number;
}

export default class Context {

	public variables: Array<variable>;
	public stack: Array<stackframe>;

	constructor(line: number, variables: Object, exception: string, errInfo: string, stack: Object);
}
