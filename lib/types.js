// Default values for option parameters
const ForkOptions = {
  port: '8545',
  hostname: 'localhost',
  debug: true,
  seed: null,
  mnemonic: null,
  total_accounts: null,
  blocktime: null,
  gasPrice: null,
  gasLimit: 3000000, // 3mil gas
  accounts: null, // was parseAccounts(accounts)
  unlocked_accounts: null,
  fork: 'http://localhost:8545',
  network_id: null,
  verbose: false,
  secure: null,
  db_path: null,
  account_keys_path: null,
  logger: console, // TODO: Make a debug logger
};

/**
 * Const Error Declarations
 * standard event names: <Class>:<Event>
 * where Class is the classname (in all lowercase) and Event is the event
 * also in all lowercase.
 */
const events = {
  forkReady: 'fork:ready',
  testRPCBreakpoint: 'testRPC:breakpoint',
};

const loggerLevels = {
  DEBUG: 5,
  WARNING: 4,
  ERROR: 3,
  CRITICAL: 2,
  FATAL_ONLY: 1,
};

const Simple =
  `pragma solidity ^0.4.0;

contract SimpleStorage {
    uint storedData;

    function set(uint x) {
        storedData = x;
    }

    function get() constant returns (uint) {
        return storedData;
    }
}`;

module.exports = {
  ForkOptions,
  loggerLevels,
  Simple,
  events,
};
