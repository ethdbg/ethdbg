#! /usr/bin/env node
// const { DebugProvider } = require('./../ethdbg/index');
const DebugProvider = require('./debug_provider');
const EthdbgError = require('./err');

/**
 * this is what is going to be spawned; hence it does not need to be TS
 */

/**
  Available Options (taken directly from ganache-cli: 
  Full docs: https://github.com/trufflesuite/ganache-cli
pass object to ethdbg.js in spawn, ie 
`spawn('./ethdbg.js', JSON.stringify({...});`
{
  TestRPC: {
    port: <port to bind to, default 8545>
    host: <host to bind to, default 0.0.0.0>
    fork: <url> (Fork from another currently running Ethereum client at a given block)
    db:   <db path> (directory to save chain db)
    seed  <seed value for PRNG, default random>
    deterministic/-d     (uses fixed seed)
    mnemonic/-m <mnemonic>
    accounts/-a <number of accounts to generate at startup>
    acctKeys <path to file> (saves generated accounts and private keys as JSON object in specified file)
    secure/-s   (Lock accounts by default)
    unlock <accounts>   (Comma-separated list of accounts or indices to unlock)
    blocktime/-b <block time in seconds>
    networkId/-i <network id> (default current time)
    gasPrice/-g <gas price> (default 20000000000)
    gasLimit/-l <gas limit> (default 90000)"
    debug (Output VM opcodes for debugging)
    verbose/-v
    mem  (Only show memory output, not tx history)");
  },
  ethdbg: {
    loggerLevel: <Number> Amount of output to show
  }
}

ETHDBG Specific Options:
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

(() => {

  try {
    const ethdbg = new DebugProvider({loggerLevel: 6, fork: false, port: 8545});
    ethdbg.run();
  } catch (err) {
    throw new EthdbgError(`Error in ethdbg ${err}`);
  }
 })();

