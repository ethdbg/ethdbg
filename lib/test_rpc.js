#! /usr/bin/env node

/**
 * @author Andrew Plaza <aplaza@liquidthink.net>
 */

const Contract = require('./contract.js');
const {
  fork,
} = require('child_process');
const {
  EventEmitter,
} = require('events');

/**
 * Interact with Forked TestRPC object
 */
class TestRPC {
  /**
   *@param{string} location - location/hostname of testRPC
   *@param{string} contract - contract path
   *@param{string} contractName - name of the contract
   *@param{Logger} logger - logger class
   */
  constructor(location, contract, contractName, logger) {
    this.location = location;
    this.contract = contract;
    this.contractName = contractName;
    this.forkedBlockchain = null;
    this.forkAddress = null;
    this.logger = logger;
    this.readyEvent = new EventEmitter();
    this.hostnameMatch = new RegExp(/http:\/\/[\w]*:[\d]{4}/i);
    // attach an event emmitter object to the node child process
    // for the purpose of telling us when the forked testRPC is ready
    try {
      this.forkedBlockchain = fork('./fork.js');
    } catch (err) {
      throw new Error('Error forking blockchain: ', err);
    }
  }

  /** Sets up listeners for forked testRPC */
  initEvents() {
    this.forkedBlockchain.on('message', (msg) => {
      /* console.log("Received message!: ", msg);
       * Init goes like this
       * |----------------------------------------|
       * | TestRPC  | Dir |   Fork     | msg_num  |
       * |----------------------------------------|
       * |  recv     <=     1          |     1    |
       * |  recv     <=     fork_addr  |     1    | (Address of forked TestRPC)
       * |  send     =>     1          |     2    |
       * |  ready    <=     'ready'    |     3    |
       * ------------------------------------------
       */
      if (msg === 1) {
        this.logger.debug('Succesfully Forked!');
      } else if (this.hostnameMatch.test(msg)) {
        this.logger.debug(`Got fork address!: ${msg}`);
        this.forkAddress = msg;
        this.forkedBlockchain.send(1);
      } else if (msg === 'ready') {
        this.logger.debug('Emitting Ready Event...');
        this.readyEvent.emit('ready');
      } else {
        throw new Error(`Could not decipher ${msg} in test_rpc on msg event`);
      }
    });

    this.forkedBlockchain.on('exit', (code) => {
      this.logger
        .debug('Forked Blockchain Exited with an exit code of: ', code);
    });

    this.forkedBlockchain.on('error', (err) => {
      this.logger.debug('Forked Blockchain exited due to: ', err);
    });
  }

  /**
   * Runs the contract that is being debugged
   */
  runContract() {
    // once the forked blockchain is ready to be deployed to, deploy contract
    this.readyEvent.on('ready', () => {
      let contract = new Contract(this.forkAddress,
        this.contract,
        this.contractName,
      this.logger);
      contract.deploy();
      contract.test((c) => {
        let result = c.get();
        this.logger.debug('Result');
        this.logger.debug(result);
      });
    });
  }
}

/**
 * test func
 */
function testRpc() {
  const Logger = require('./logger.js');
  let logger = new Logger(5);
  let test = new TestRPC(
    'http://localhost:8545',
    './../examples/example_solidity/simple.sol',
    'SimpleStorage',
    logger
  );

  test.initEvents();
  test.runContract();
}

testRpc();
