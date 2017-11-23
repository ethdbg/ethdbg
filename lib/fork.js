const URL = require('url');
const Web3 = require('web3');
const _ = require('lodash');
const Ganache = require('ganache-core');
const {ForkOptions} = require('./types.js');
const Logger = require('./logger');

/**
 * Some code taken from ethereumjs/testrpc
 * Forks a running TestRPC + blockchain. Used for access to underlying EVM
 * @private
 * @param {Logger} logger - logger class for debug/general output
 * @param {Object} options - option for testRPC
 */
class Fork {
  constructor(logger, options) {
    this.options = {};
    _.merge(this.options, ForkOptions, options);
    this.forkAddress = null;
    this.server = null;
    this.state = null;
    this.web3 = new Web3();
    this.logger = logger;
  }

  /**
   * Starts a server and begins to listen
   */
  init() {
    this.parseAddress();
    try {
      this.server = Ganache.server(this.options);
    } catch (err) {
      throw new Error('Error in initializing ganache server', err);
    }

    this.server.listen(
      this.options.port,
      this.options.hostname,
      this.listen.bind(this));
  }

  /**
   * We don't want to start a server with the same port as an already-running
   * server. parseAddress makes sure we don't
   */
  parseAddress() {
    let split = this.options.fork.split('@');
    this.forkAddress = split[0];
    let block;
    if (split.length > 1) {
      block = split[1];
    }

    if (URL.parse(this.forkAddress).port == this.options.port) {
      this.options.port = (parseInt(this.options.port) + 1);
    }
    this.options.fork = this.forkAddress + (block != null ? '@' + block : '');
  }

  /**
   * The callback function passed to Ganache's server.listen()
   * @param {string} err - Error
   * @param {Object} result - Result returned from server
   */
  listen(err, result) {
    if (err) {
      throw new Error('Error in listening to ganache server', err);
    }

    this.state = result ? result : this.server.provider.manager.state;

    // add our events to the ethereumJS EVM object
    let newEVM = Object.assign(this.state.blockchain.vm, {
      __ethdbg: this.ethdbg,
    });
    this.state.blockchain.vm = newEVM;

    this.initServerEvents();
    if (this.options.fork) this.printForkMessage();

    // begin informing parent of ready state (first step)
    process.send(1);
    let address =
      (this.options.hostname || 'localhost') +
      ':' +
      this.options.port;
    process.send(`http://${address}`);
    this.logger.debug(`Listening on ${address}`);
  }

  /** listen for Ethereum Virtual Machine or ethdbg events */
  initServerEvents() {
    this.state.blockchain.vm.on('step', (eventObj) => {
      this.logger.debug(`Executed ${eventObj.opcode.name} \
      instruction in fork.js`);
    });

    process.on('message', (msg) => {
      // when we get back a 1, send ready event
      if (msg === 1) {
        process.send('ready');
      }
    });
  }

  /** prints the logger fork message */
  printForkMessage() {
    this.logger.debug('');
    this.logger.debug('Forked Chain');
    this.logger.debug('==================');
    this.logger.debug('Location:    ' + this.forkAddress);
    this.logger.debug('Block:       ' + this.web3.toBigNumber(this.state
      .blockchain
      .fork_block_number).toString(10));
    this.logger.debug('Network ID:  ' + this.state.net_version);
    this.logger.debug('Time:        ' + (this.state
        .blockchain
        .startTime || new Date())
      .toString());
    this.logger.debug('');
  }
}

function fork() {
  let logger = new Logger(5);
  let forkedRPC = new Fork(logger, {});
  forkedRPC.init();
} fork();

module.exports = Fork;
