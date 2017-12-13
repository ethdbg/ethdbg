export default class Context {

	public variables: Array<Object>;
	public stack: Array<Object>;

	constructor(line: number, variables: Object, exception: string, errInfo: string, stack: Object);
}
