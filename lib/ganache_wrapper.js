const URL = require('url');
const Web3 = require('web3');
const Ganache = require('ganache-core');
const _ = require('lodash');
const EventManager = require('./event_manager');
const { waitForEventWithTimeout } = require('./utils');
const { ForkOptions } = require('./types.js');
const forkReadyEv = 'forkReady';

/**
 * Some code taken from ethereumjs/testrpc
 * Forks a running TestRPC + blockchain. Used for access to underlying EVM
 * This particular module works by extending ganache
 * @author Andrew Plaza
 * @private
 * @param {Logger} logger - logger class for debug/general output
 * @param {Object} options - option for testRPC
 */
class GanacheWrapper {
  constructor(logger, options) { // eslint-disable-line require-jsdoc
    this.logger = logger;
    this.server = null;
    this.hostAddress = null;
    this.forkAddress = null;
    this.options = {};
    _.merge(this.options, ForkOptions, options);
    this.state = null;
    this.web3 = new Web3();
    this.vm = null;
  }

  /**
   * returns the provider this testRPC instance is associated with
   * @return{string}
   */
  getProvider() {
    return this.forkAddress;
  }

  /**
   * Starts a server and begins to listen
   * Returns the EVM instance of the TestRPC
   * @return{Object}
   * @private
   */
  async init() {
    this.options.fork ? this.parseAddress() : null;
    try {
      this.server = Ganache.server(this.options);
    } catch (err) {
      throw new Error('Error in initializing ganache server', err);
    }

    this.server.listen(
      this.options.port,
      this.options.hostname,
      this.listen.bind(this)
    );
    await waitForEventWithTimeout(
      EventManager,
      forkReadyEv,
      1000,
      'Failed to initialize server ${this.options.hostname}'
    );
    return this.vm;
  }

  /**
   * We don't want to start a server with the same port as an already-running
   * server. parseAddress makes sure we don't
   * @return {number} returns block forking from
   * @private
   */
  parseAddress() {
    let split = this.options.fork.split('@');
    this.hostAddress = split[0];
    let block;
    if (split.length > 1) {
      block = split[1];
    }

    if (URL.parse(this.hostAddress).port == this.options.port) {
      this.options.port = (parseInt(this.options.port) + 1);
    }
    this.options.fork = this.hostAddress + (block != null ? '@' + block : '');
    return parseInt(block);
  }

  /**
   * The callback function passed to Ganache's server.listen()
   * @param {string} err - Error
   * @param {Object} result - Result returned from server
   * @private
   */
  listen(err, result) {
    if (err) {
      throw new Error('Error in listening to ganache server', err);
    }

    this.state = result ? result : this.server.provider.manager.state;

    // add our events to the ethereumJS EVM object
    this.forkAddress = 'http://' +
      (this.options.hostname) + ':' + this.options.port;
    if (this.options.fork) this.printForkMessage();
    else this.printWelcomeMessage();
    this.vm = this.state.blockchain.vm;
    this.logger.info('TestRPC ready');
    EventManager.emit(forkReadyEv);
  }

  /**
   * prints the logger fork message
   * @private
   */
  printForkMessage() {
    this.welcomeASCII();
    this.logger.info('');
    this.logger.info('              Forked Chain               ');
    this.logger.info('=========================================');
    this.logger.info('Location:    ' + this.forkAddress);
    this.logger.info('Block:       ' + this.web3.toBigNumber(this.state
      .blockchain
      .fork_block_number).toString(10));
    this.logger.info('Network ID:  ' + this.state.net_version);
    this.logger.info('Time:        ' + (this.state
        .blockchain
        .startTime || new Date())
      .toString());
    this.logger.info('');
    return;
  }

  /**
   * print test RPC welcome message
   * @private
   */
  printWelcomeMessage() {
    this.welcomeASCII();
    this.logger.info('');
    this.logger.info('                  BlockChain             ');
    this.logger.info('=========================================');
    this.logger.info('Location:    ' + this.forkAddress);
    this.logger.info('Network ID:  ' + this.state.net_version);
    this.logger.info('Time:        ' + (this.state
        .blockchain.startTime || new Date()).toString());
    this.logger.info('');
  }

  /**
   * a nifty ASCII of ethdbg
   */
  welcomeASCII() {
    this.logger.info(`        __  .__         .______.             `);
    this.logger.info(`  _____/  |_|  |__    __| _/\\_ |__    ____  `);
    this.logger.info(`_/ __ \\   __\\  |  \\  / __ |  | __ \\  / ___\\ `);
    this.logger.info(`\\  ___/|  | |   Y  \\/ /_/ |  | \\_\\ \\/ /_/  >`);
    this.logger.info(` \\___  >__| |___|  /\\____ |  |___  /\\___  / `);
    this.logger.info(`     \\/          \\/      \\/      \\//_____/  `);
    this.logger.info(`                                            `);
  }
}

module.exports = GanacheWrapper;
