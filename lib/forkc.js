#! /usr/bin/env node
var URL = require("url");
var fs = require("fs");
var Web3 = require ("web3");
var web3 = new Web3();
var { EventEmitter } = require("events");
var Ganache = require("../../ganache-core/index.js");

class Fork {

  constructor(options) {
    let logger = console;
    this.options = {
      port: "8545",
      hostname: options.hostname,
      debug: true,
      seed: options.seed,
      mnemonic: options.mnemonic,
      total_accounts: options.account,
      blocktime: options.blocktime,
      gasPrice: options.gasPrice,
      gasLimit: options.gasLimit || 3000000 //3mil gas
      accounts: null, // was parseAccounts(accounts)
      unlocked_accounts: options.unlock,
      fork: options.fork || 'http://localhost:8545',
      network_id: options.networkId,
      verbose: options.verbose,
      secure: options.secure,
      db_path: options.db || null,
      account_keys_path: options.acctKeys || null, 
      logger: logger, // TODO: Make a debug logger
    }
    this.fork_address = null;
    this.server = null;
    this.state = null;
  }

  init() {
    this.parse_address();
    try {
      this.server = Ganache.server(this.options);
    } catch(err) {
      throw new Error("Error in initializing ganache server", err);
      console.log("Exiting...");
      process.exit(1);
    }

    this.server.listen(this.options.port, this.options.hostname, this.listen);
  }
 
  parse_address() {
    let split = this.options.fork.split("@");
    this.fork_address = split[0];
    let block;
    if (split.length > 1) {
      block = split[1];
    }

    if (URL.parse(this.fork_address).port == this.options.port) {
      this.options.port = (parseInt(this.options.port) + 1);
    }
    this.options.fork = this.fork_address + (block != null ? "@" + block : "");
  }

  listen(err, result) {
    if ( err ) {
      throw new Error("Error in listening to ganache server", err);
      process.exit(1);
    }
    
    this.state = result ? result : this.server.provider.manager.state;
    this.init_server_events();

    if(this.options.fork) { this.print_fork_message(); }

    // begin informing parent of ready state (first step)
    process.send(1);
    let address = (this.options.hostname || "localhost") + ":" + this.options.port;
    process.send(`http://${address}`);
    console.log(`Listening on ${address}`);
  }

  // listen for Ethereum Virtual Machine or ethdbg events
  init_server_events() {
    this.state.blockchain.vm.on('step', () => {
      console.log("Executed instruction in fork.js");
    });

    process.on('message', (msg) => {
      // when we get back a 1, send ready event
      if(msg === 1) {
        process.send('ready');
      }
    });
  }

  print_fork_message() {
    console.log("");
    console.log("Forked Chain");
    console.log("==================");
    console.log("Location:    " + this.fork_address);
    console.log("Block:       " + web3.toBigNumber(this.state.blockchain.fork_block_number).toString(10));
    console.log("Network ID:  " + this.state.net_version);
    console.log("Time:        " + (this.state.blockchain.startTime || new Date()).toString());
    console.log("");
  }
}

