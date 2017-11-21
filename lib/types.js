import Logger from './logger';

// Default values for option parameters
export const ForkOptions = {
    port: '8545',
    hostname: 'localhost',
    debug: false,
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

export const loggerLevels = {
  DEBUG: 5,
  WARNING: 4,
  ERROR: 3,
  CRITICAL: 2,
  FATAL_ONLY: 1,
};

export const Simple =
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
