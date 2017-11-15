#! /usr/bin/env node
var URL = require("url");
var fs = require("fs");
var yargs = require("yargs/yargs");
var Web3 = require("web3");
var web3 = new Web3(); // Used only for its BigNumber library.
var sleep = require("sleep");
var Ganache = require("../../ganache-core/index.js");

/**
 * Taken from ethereumjs/testrpc
 */
var parser = yargs()
.option("unlock", {
  type: "string",
  alias: "u"
});
var argv = parser.parse(process.argv);
var logger = console;
var options = {
  port: "8545",
  hostname: argv.h || argv.hostname,
  debug: argv.debug,
  seed: argv.s || argv.seed,
  mnemonic: argv.m || argv.mnemonic,
  total_accounts: argv.a || argv.accounts,
  blocktime: argv.b || argv.blocktime,
  gasPrice: argv.g || argv.gasPrice,
  gasLimit: argv.l || argv.gasLimit || 3000000,
  accounts: null, // was parseAccounts(accounts)
  unlocked_accounts: argv.unlock,
  fork: argv.f || argv.fork || 'http://localhost:8545',
  network_id: argv.i || argv.networkId,
  verbose: argv.v || argv.verbose,
  secure: argv.n || argv.secure || false,
  db_path: argv.db || null,
  account_keys_path: argv.acctKeys || null,
  logger: logger
}

/*returns the EVM Object after forking the blockchain from the running TestRPC
 * Currently only works with ethereumjs/testrpc
 * Other TestRPC's will be supported (As long as the testRPC is using a VM with a vm.on
 * hook in the EVM
 */
function fork() {
  var output;
  var fork_address;

  // Make sure we don't use the same port as the testRPC we are forking from
  var split = options.fork.split("@");
  fork_address = split[0];
  var block;
  if (split.length > 1) {
    block = split[1];
  }

  if (URL.parse(fork_address).port == options.port) {
    options.port = (parseInt(options.port) + 1);
  }
  options.fork = fork_address + (block != null ? "@" + block : "");

  try {
    server = Ganache.server(options);
  } catch (err) {
    throw new Error("Error in instantiating ganache server " + err);
  }

  server.listen(options.port, options.hostname, (err, result) => {
    
    if (err) {
      // output JSON with error to Rust process
    throw new Error("Error in Fork(): " + err);
      return;
    }

    let state = result ? result : server.provider.manager.state;
       
    if (options.fork) {
      console.log("");
      console.log("Forked Chain");
      console.log("==================");
      console.log("Location:    " + fork_address);
      console.log("Block:       " + web3.toBigNumber(state.blockchain.fork_block_number).toString(10));
      console.log("Network ID:  " + state.net_version);
      console.log("Time:        " + (state.blockchain.startTime || new Date()).toString());
      console.log("");
    }
    process.send(1);
    process.send(fork_address);

    console.log("setting up events!");
    state.blockchain.vm.on('step', () => {
      console.log("Executed Instruction!");
    });
    process.on('message', (msg) => {
      console.log("Child got message!: " + msg);
    });
    
    console.log("Listening on " + (options.hostname || "localhost") + ":" + options.port);
    
  });
}

function events(vm) {
  console.log("setup up events!");
  vm.on('step', () => {
    console.log("Executed Instruction!");
  });
  process.on('message', (msg) => {
    console.log("Child got message!: " + msg);
  });
}
fork();

