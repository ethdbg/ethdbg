export default class Context {

	public variables: Object;
	public stack: Object;

	constructor(line: number, variables: Object, exception: string, errInfo: string, stack: Object);
}
