const Web3 = require('web3');
const _ = require('lodash');
const {promisify} = require('util');
const remixLib = require('remix-lib');
const remixCore = require('remix-core');
const Web3Providers = remixLib.vm.Web3Providers;
const global = remixLib.global;
const CodeManager = require('../remix/codeManager');
const SourceLocationTracker = require('./../util/sourceLocationTracker');
const Logger = require('./../logger');
const {isDef,} = require('./../utils');
const {events} = require('./../types');

let locTrackers = new Map();
// name stored in locTrackers: 'Contract:Method'
// if deploy step, 'Contract:_init'
let logger;

// Global Unhandled Promise Rejection Error Handler, for uncaught errors
process.on('unhandledRejection', (error) => {
  console.log('Unhandled Rejection Error in Eth Debug: ', error.message);
  console.log(error);
});

/**
 * get the source location in the contract from the program counter
 * This method operates slightly differently then the other contract workers
 * in that it caches the contract code that is required, in order to
 * needs: pc, provider, txObj, addr, hexCode, name
 * pc, provider
 */
async function getSourceLocationFromPC(options) {
  logger = new Logger(options.loggerLevel);
  if (locTrackers.has(options.name)) {
    srcLocHelper(options.name, options.pc, options.runtimeMap);
    console.log("LOC TRACKERS");
    console.log(locTrackers);
  } else {
    const web3 = new Web3(new Web3.providers.HttpProvider(options.provider));
    await initCodeManager(options.tx, web3, options.hexCode, options.name);
    srcLocHelper(options.name, options.pc, options.runtimeMap);
  }
}

async function srcLocHelper(name, pc, runtimeMap) {
  const srcLocTracker = locTrackers.get(name);
  const getSrcFromPC = promisify(
    srcLocTracker.getSourceLocationFromVMTraceIndex.bind(
      srcLocTracker)
  );
  const srcLoc = await getSrcFromPC(name, pc, runtimeMap);
  process.send(srcLoc);
}

// the arguments we get as a message from parent process
process.on(events.message, (msg) => {
  getSourceLocationFromPC(JSON.parse(msg));
});


/**
 * init the trace manager
 * @param{Object} tx - transaction object from Web3
 * @param{Object} web3 - web3 object
 * @param{string} hexCode - hexCode of contract
 * @param{string} name - name in contract:MethodName format
 */
async function initCodeManager(tx, web3, hexCode, name) {
  let codeManager;
  let sourceLocationTracker;
  if (!isDef(tx)) throw new Error('tx obj must be defined');
  try {
    let web3Providers = new Web3Providers();
    promisify(web3Providers.addProvider
      .bind(web3Providers))('ETHDBG', web3);

    global.web3 = await promisify(web3Providers.get
      .bind(web3Providers))('ETHDBG');
    codeManager = new CodeManager();
    sourceLocationTracker = new SourceLocationTracker(codeManager);
  } catch (err) {
    throw new Error(`Could not resolve trace: ${err}`);
  }
  await cacheCode(name, hexCode, codeManager);
  locTrackers.set(name, sourceLocationTracker);
}

/**
 * Caches code with remix. Needed for getting location from PC
 * @param{name} - name in 'Contract:MethodName' format
 * @param{hexCode} - hex of code (from web3.eth.getCode)
 * @param{CodeManager} - codeManager to get cached code from
 */
async function cacheCode(name, hexCode, codeManager) {
  codeManager.codeResolver.cacheExecutingCode(
    name, // used to retrieve code *I think*
    hexCode,
  );
}


