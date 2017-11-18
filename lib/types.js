#! /usr/bin/env node

// Default values for option parameters
var logger = console;
module.exports = {
  fork_options: {
    port: "8545",
    hostname: "localhost",
    debug: false,
    seed: null,
    mnemonic: null,
    total_accounts: null,
    blocktime: null,
    gasPrice: null,
    gasLimit: 3000000, //3mil gas
    accounts: null, // was parseAccounts(accounts)
    unlocked_accounts: null,
    fork: 'http://localhost:8545',
    network_id: null,
    verbose: false,
    secure: null,
    db_path: null,
    account_keys_path: null, 
    logger: logger, // TODO: Make a debug logger
  },
  logger_levels: {
    DEBUG: 5,
    WARNING: 4,
    ERROR: 3,
    CRITICAL: 2,
    FATAL_ONLY: 1,
  },
}