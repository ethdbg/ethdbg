#! /usr/bin/env node
const Contract = require('./contract');
const {fork} = require('child_process');
const {EventEmitter} = require('events');
const SourceMap = require('./source_map');
const Logger = require('./logger');
const {Simple} = require('./types');

/**
 * Interact with Forked TestRPC object
 * @author Andrew Plaza <aplaza@liquidthink.net>
 * @param {Logger} logger - logger class
 * @private
 */
class TestRPC {
  constructor(logger, sourceMap) {
    this.logger = logger;
    this.sourceMap = sourceMap;
    this.forkedBlockchain = null;
    this.forkAddress = null;
    this.readyEvent = new EventEmitter();
    this.debugger = new EventEmitter();
    // attach an event emmitter object to the node child process
    // for the purpose of telling us when the forked testRPC is ready
    try {
      this.forkedBlockchain = fork(`${__dirname}/fork.js`);
    } catch (err) {
      throw new Error('Error forking blockchain: ' + err);
    }
  }

  /** 
   * Sets up listeners for forked testRPC 
   * @private
   */
  initEvents() {
    const hostnameMatch = new RegExp(/http:\/\/[\w]*:[\d]{4}/i);
    this.forkedBlockchain.on('message', (msg) => {
      /*
       * Init goes like this
       * |----------------------------------------|
       * | TestRPC  | Dir |   Fork     | msg_num  |
       * |----------------------------------------|
       * |  recv     <=     1          |     1    |
       * |  recv     <=     fork_addr  |     1    | (Address of forked TestRPC)
       * |  send     =>     sourceMap  |     2    |
       * |  send     =>     1          |     2    |
       * |  recv     <=     'ready'    |     3    |
       * ------------------------------------------
       */
      if (msg === 1) {
        this.logger.debug('Succesfully Forked!');
      } else if (hostnameMatch.test(msg)) {
        this.logger.debug(`Got fork address!: ${msg}`);
        this.forkAddress = msg;
        this.forkedBlockchain.send(
          JSON.stringify(this.sourceMap.getJSONMapArray()));
        this.forkedBlockchain.send(1);
      } else if (msg === 'ready') {
        this.logger.debug('Emitting Ready Event...');
        this.readyEvent.emit('ready');
      } else if (msg='hitbreakpoint') {
        this.logger.debug('Hit a breakpoint.');
        this.debugger.emit('hitbreakpoint');
      } else {
        throw new Error(`Could not decipher ${msg} in test_rpc on msg event`);
      }
    });

    this.debugger.on('hitbreakpoint', () => {
        // pause execution...
        // hand over context info (code, locals, etc) to the debugger
    });

    this.forkedBlockchain.on('exit', (code) => {
      this.logger
        .debug('Forked Blockchain Exited with an exit code of: ' + code);
        if (code === 1) {
          throw new Error('Forked Blockchain Exited due to error');
        }
    });

    this.forkedBlockchain.on('error', (err) => {
      this.logger.debug('Forked Blockchain exited due to: ', err);
      throw new Error(err);
    });
  }

  /**
   * Runs the contract that is being debugged
   * @param {Contract} contract - Contract object
   * @param {Function} cb - called once the contract is deployed
   * @private
   */
  runContract(contract, cb) {
    // once the forked blockchain is ready to be deployed to, deploy contract
    // TODO: Should be made with promises or async/await (async/await pref)
    this.readyEvent.on('ready', (cb) => {
      let _contract = new Contract(this.forkAddress,
        contract.getPath(),
        contract.getName(),
        this.logger
      );
      _contract.deploy();
      -contract.test((c, cb) => {
        let result = c.get();
        this.logger.debug('Result');
        this.logger.debug(result);
        cb();
      });
    });
  }
}

module.exports = TestRPC;


function test() {
  const logger = new Logger(4);
  let contract = new Contract(
    'http://localhost:8546',
    '../examples/example_solidity/simple.sol',
    'SimpleStorage',
    logger,
    {},
  );
  const sourceMap = new SourceMap(logger, contract);
  const testRpc = new TestRPC(logger, sourceMap);
  testRpc.initEvents();
  testRpc.runContract(contract, () => {
    logger.debug("Contract tested");
  });
}

