#! /usr/bin/env node
// const { DebugProvider } = require('./../ethdbg/index');
const DebugProvider = require('./debug_provider');
const EthdbgError = require('./err');
const yargs = require('yargs');

/**
 * this is what is going to be spawned; hence it does not need to be TS
 */

/**
  Available Options (taken directly from ganache-cli:
  Full docs: https://github.com/trufflesuite/ganache-cli
pass object to ethdbg.js in spawn, ie
`spawn('./ethdbg.js', JSON.stringify({...});`

/* eslint-disable */
/*
  --port/-p: <port to bind to, default 8545>
  --host/-h: <host to bind to, default 0.0.0.0>
  --fork/-f: <url> (Fork from another currently running Ethereum client at a given block)
  --db:   <db path> (directory to save chain db)
  --seed/-s  <seed value for PRNG, default random>
  --deterministic/-d     (uses fixed seed)
  --mnemonic/-m <mnemonic>
  --accounts/-a <number of accounts to generate at startup>
  --acctKeys <path to file> (saves generated accounts and private keys as JSON object in specified file)
  --secure/-s   (Lock accounts by default)
  --unlock <accounts>   (Comma-separated list of accounts or indices to unlock)
  --blocktime/-b <block time in seconds>
  --networkId/-i <network id> (default current time)
  --gasPrice/-g <gas price> (default 20000000000)
  --gasLimit/-l <gas limit> (default 90000)"
  --debug (Output VM opcodes for debugging)
  --verbose/-v
  --mem  (Only show memory output, not tx history)");
  --log-level: level of output to show
} */
/* eslint-enable */

/* ETHDBG Specific Options:
loggerLevel: Amount of output to show,
  - 6: Everything (Debug)
  - 5: INFO (User Info)
  - 4: Warnings
  - 3: Errors
  - 2: Critical Errors
  - 1: Fatal Errors
  - 0: Silent (Not Recommended)
  a Level of '5' will also print error levels 1-4, level of 4, 1-3, and so on.
*/

const parser = yargs()
  .options('unlock', {
    type: 'string',
    alias: 'u'
  });
let argv = parser.parse(process.argv);

if (argv.d || argv.deterministic) {
  // Seed phrase; don't change to Ganache, maintain original determinism
  argv.s = "TestRPC is awesome!"; 
}

if (typeof argv.unlock == "string") {
  argv.unlock = [argv.unlock];
}

let logger = console; // ganache-core logger
// If the mem argument is passed, only show memory output,
// not transaction history.
if (argv.mem === true) {
  logger = {
    log: function() {}
  };

  setInterval(function() {
    console.log(process.memoryUsage()); // eslint-disable no-console
  }, 1000);
}

/**
 * get options from process.argv
 * @return{Object}
 */
let options = {
  port: argv.p || argv.port || '8545',
  hostname: argv.h || argv.hostname,
  debug: argv.debug,
  seed: argv.s || argv.seed,
  mnemonic: argv.m || argv.mnemonic,
  total_accounts: argv.a || argv.accounts,
  blocktime: argv.b || argv.blocktime,
  gasPrice: argv.g || argv.gasPrice,
  gasLimit: argv.l || argv.gasLimit,
  accounts: parseAccounts(argv.account),
  unlocked_accounts: argv.unlock,
  fork: argv.f || argv.fork || false,
  network_id: argv.i || argv.networkId,
  verbose: argv.v || argv.verbose,
  secure: argv.n || argv.secure || false,
  db_path: argv.db || null,
  account_keys_path: argv.acctKeys || null,
  logger: logger,
  loggerLevel: argv.loglvl || 5,
}

/**
 * gets acc from cmd arg
 * @param{string} accounts
 * @return{Array}
 * @private
 */
function parseAccounts(accounts) {
  /**
   * splits string up by acc
   * @param{string} account
   * @return{Object}
   * @private
   */
  function splitAccount(account) {
    account = account.split(',')
    return {
      secretKey: account[0],
      balance: account[1]
    };
  }

  if (typeof accounts === 'string') return [splitAccount(accounts)];
  else if (!Array.isArray(accounts)) return;

  let ret = []
  for (let i = 0; i < accounts.length; i++) {
    ret.push(splitAccount(accounts[i]));
  }
  return ret;
}

(() => {
  try {
    const ethdbg = new DebugProvider(options);
    ethdbg.run();
  } catch (err) {
    throw new EthdbgError(`Error in ethdbg ${err}`);
  }
 })();

