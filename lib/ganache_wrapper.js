const URL = require('url');
const Web3 = require('web3');
const _ = require('lodash');
const Ganache = require('ganache-core');
const HashMap = require('hashmap');
const EventManager = require('./event_manager');
const {ForkOptions, events} = require('./types.js');
const Logger = require('./logger');
const TestRPC = require('./test_rpc');

/**
 * Some code taken from ethereumjs/testrpc
 * Forks a running TestRPC + blockchain. Used for access to underlying EVM
 * This particular module works by extending ganache
 * @param {Logger} logger - logger class for debug/general output
 * @param {SourceMap} sourceMap - SourceMap class for mapping bytecode to src
 * @param {Object} options - option for testRPC
 * @private
 */
class GanacheWrapper extends TestRPC {
  constructor(logger, sourceMap, options) {
    super(logger, sourceMap);
    this.options = {};
    _.merge(this.options, ForkOptions, options);
    this.hostAddress = null;
    this.forkAddress = null;
    this.server = null;
    this.state = null;
    this.web3 = new Web3();
    this.logger = logger;
  }

  /**
   * Starts a server and begins to listen
   * @private
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
    let newEVM = Object.assign(this.state.blockchain.vm, {
      __ethdbg: this.ethdbg,
    });
    this.state.blockchain.vm = newEVM;
    this.forkAddress = 'http://' +
      (this.options.hostname) + ':' + this.options.port;
    if (this.options.fork) this.printForkMessage();
    this.initServerEvents();
    console.log("Get to the ready event");
    EventManager.emit(events.forkReady);
  }

  /** 
   * listen for Ethereum Virtual Machine or ethdbg events 
   * @private
   */
  initServerEvents() {
    this.state.blockchain.vm.on('step', (eventObj) => {
      this.logger.debug(
        `Executed ${eventObj.opcode.name} instruction in fork.js`);
      this.logger.debug(eventObj);
    });
  }

  /** 
   * prints the logger fork message 
   * @private
   */
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
    return;
  }
}

module.exports = GanacheWrapper;