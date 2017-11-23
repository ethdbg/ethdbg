const Contract = require('./contract');
const {fork} = require('child_process');
const {EventEmitter} = require('events');
const Logger = require('./logger');
const {Simple} = require('./types');

/**
 * Interact with Forked TestRPC object
 * @private
 * @author Andrew Plaza <aplaza@liquidthink.net>
 * @param {Contract} contract - contract Object
 * @param {Logger} logger - logger class
 */
class TestRPC {
  constructor(logger) {
    this.forkedBlockchain = null;
    this.forkAddress = null;
    this.logger = logger;
    this.readyEvent = new EventEmitter();
    // attach an event emmitter object to the node child process
    // for the purpose of telling us when the forked testRPC is ready
    try {
      this.forkedBlockchain = fork(`${__dirname}/fork.js`);
    } catch (err) {
      throw new Error('Error forking blockchain: ' + err);
    }
  }

  /** Sets up listeners for forked testRPC */
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
       * |  send     =>     1          |     2    |
       * |  ready    <=     'ready'    |     3    |
       * ------------------------------------------
       */
      if (msg === 1) {
        this.logger.debug('Succesfully Forked!');
      } else if (hostnameMatch.test(msg)) {
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
   */
  runContract(contract, cb) {
    // once the forked blockchain is ready to be deployed to, deploy contract
    // TODO: Should be made with promises or async/await (async/await pref)
    this.readyEvent.on('ready', (cb) => {
      let contract = new Contract(this.forkAddress,
        contract.getPath(),
        contract.getName(),
        this.logger
      );
      contract.deploy();
      contract.test((c, cb) => {
        let result = c.get();
        this.logger.debug('Result');
        this.logger.debug(result);
        cb();
      });
    });
  }
}

module.exports = TestRPC;
