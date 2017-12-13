export default class Contract {

  getRealName(name: string): string;

  getSource(): string;

  getRuntimeMap(): string;

  getBytecode(): string;

  getRuntimeBytecode(): string;

  getName(): string;

  getPath(): string;

  getABI(json: boolean): string;

  getAST(): Object;

  getFullCompiledSource(): Object;

  getAddress(): string;

  getTxHash(): string;

  getLatestTxHash(): string;

  getDeployReceipt(): Object;

  getAssocAddr(): Object;

  associate(addr: string): Contract;

  checkContract(): void;

}