/**
 * @file essentially enum constants used throughout ethdbg
 * @private
 */


// Default values for option parameters
const ForkOptions = {
  port: '8546',
  hostname: 'localhost',
  debug: false,
  seed: null,
  mnemonic: null,
  total_accounts: null,
  blocktime: null,
  gasPrice: null,
  gasLimit: 3000000, // 3mil gas
  accounts: null, // was parseAccounts(accounts)
  unlocked_accounts: [0],
  fork: 'http://localhost:8545',
  network_id: null,
  verbose: false,
  secure: null,
  db_path: null,
  account_keys_path: null,
  logger: console, // TODO: Make a debug logger
};

/**
 * standard event names: <Class>:<Event>
 * where Class is the classname (in all lowercase) and Event is the event
 * also in all lowercase.
 * @private
 */


/**
 * standard event names: <Class>:<Event>
 * where Class is the classname (in all lowercase) and Event is the event
 * `ready`: **[OUTPUT]** TestRPC is ready to be used as normal
 * `hitBreakpoint`: **[OUTPUT]** Debugger hit a breakpoint
 * `begin`: **[INPUT]** start TestRPC. Only available when using `DebugProvider`
 * `isReady`: **[INPUT]** check if TestRPC is ready
 * `addBreakpoints`: **[INPUT]** add breakpoints and the file bp belongs to (if not yet existent)
 * `removeBreakpoints`: **[INPUT]** remove breakpoints
 * `addFiles`: **[INPUT]** add files to debug
 * `start`: **[INPUT]** start scanning for breakpoints/etc
 * `stop`: **[INPUT]** stop scanning for breakpoints/etc
 * `continue`: **[INPUT]** continue execution to next breakpoint
 * `stepInto`: **[INPUT]** step into current line
 * `stepOver`: **[INPUPT]** step over current line
 * `kill`: **[INPUT]** kill testRPC/Debugger
 * `message`: NodeJS message event
 * Events to be used with Debugger/DebugProvider
 * @public
 */
/* eslint-disable */
const events = {
  begin:              'begin',
  isReady:            'isReady',
  ready:              'ready',
  hitBreakpoint:      'hitBreakpoint',
  addBreakpoints:     'addBreakpoints',
  removeBreakpoints:  'removeBreakpoints',
  toggleBreakpoint:   'toggleBreakpoint',
  addFiles:           'addFiles',
  start:              'start',
  stop:               'stop',
  continue:           'continueExecution',
  stepInto:           'stepInto',
  stepOver:           'stepOver',
  kill:               'EXECUTE_ORDER_66',
  message:            'message',
};
/* eslint-enable */

const Accounts = {
  coinbase: 'coinbase',
};

const t_BigNumber = {
  base10: 10,
  base16: 16,
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
  Accounts,
  t_BigNumber,
};
