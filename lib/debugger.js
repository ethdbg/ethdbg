const ContractManager = require('./contract_manager');
const Contract = require('./contract');
const Logger = require('./logger');
const GanacheWrapper = require('./ganache_wrapper');
const EventEmitter = require('events');
const REPL = require('./repl');
const {
  isDef,
    waitForEvents,
} = require('./utils');
const { events } = require('./types');
require('./event_manager'); // avoid promise rejections

/**
 * Where the magic is abstracted, and the pain goes away<br>
 * 'this' is returned to allow for chaining of methods
 * @author Sean Batzel
 * @author Andrew Plaza <aplaza@liquidthink.net>
 * @param {Object} options - options
 *  - `loggerLevel` level of log output
 * @public
 */
class Debugger extends EventEmitter {
    // TODO: cleanup up the options
    constructor(options) { // eslint-disable-line require-jsdoc
        super();
        // TODO: optionally pull options from options config file
        let loglvl;
        let logProvMode; // logger provider mode
        if (isDef(options.ethdbg)) {
            loglvl = options.ethdbg.loggerLevel;
            logProvMode = options.ethdbg.loggerProviderMode;
        } else if (
            isDef(options.loggerLevel) &&
            isDef(options.loggerProviderMode)
        ) {
            loglvl = options.loggerLevel
            logProvMode = options.loggerProviderMode
        } else if (isDef(options.loggerLevel)) {
            loglvl = options.loggerLevel;
        }
        this.logger = new Logger(loglvl, logProvMode);
        this.cManager = new ContractManager(this.logger);
        this.vm = null;
        this.testRPC = null;
        this.rpcOpts = isDef(options.testRPC) ? options.testRPC : {};
        this.started = false;

        // input events
        this.on(events.addBreakpoints, (breakpoints) => {
            this.addBreakpoints(breakpoints);
        });

        this.on(events.addFile, (fpath) => {
            this.add(fpath);
        });
        this.on(events.addFiles, (files) => {
            this.addFiles(files);
        });
        this.on(events.removeBreakpoints, (breakpoints) => {
            this.removeBreakpoints(breakpoints);
        });
        this.on(events.toggleBreakpoint, (breakpoint, filepath) => {
            this.toggleBreakpoint(breakpoint);
        });
        this.on(events.continue, () => {
            if (!this.started) {
                this.events().listen();
                this.started = true;
                this.logger.debug('began listening on testRPC for breakpoints');
            }
        });
        this.on(events.start, async () => {
            await this.start();
            this.events().listen();
            this.started = true;
            this.logger.debug('began listening on testRPC for breakpoints');
        });
        this.on(events.stop, () => {
            this.events().stop();
            this.logger.debug('stopped listening on testRPC for breakpoints');
        });
        this.on(events.kill, () => {
            process.kill(0);
        });
    }

    /**
     * Enables arbitrary execution of Solidity code. When called by a client, the
     * result must be treated as an unresolved promise and resolved to a value
     * through the promise's .then() method.
     * @author Sean Batzel
     * @param {string} code - A string containing the code to be executed.
     * @return {Promise} - A promise whose .then() returns the result of the operation.
     * @public
     * @example Debugger().codeExec("uint a = 1; uint b = 1; a + b;") ==> Promise { <pending> }
     * @example Promise { <pending> }.then(result => {console.log(result)}) ==> BigNumber { s: 1, e: 0, c: [ 2 ] }
     */
    codeExec(code) {
        let repl = REPL();
        let res = repl(code)
            .then(result => {
                if (result !== null) {
                    return result;
                }
            })
            .catch(err => {
                console.log(err)
            });
        return Promise.resolve(res);
    }

    /**
     * add a contract to debug
     * @param{string} fpath - string of filepath of contract
     * @public
     * @return{Debugger}
     */
    add(fpath) {
        if (!this.cManager.has({ path: fpath })) {
            this.cManager.add(fpath);
        }
        return this;
    }

    /**
     * adds multiple files to debug
     * @param{Array<string>} files - an array of file paths
     * @public
     * @return {Debugger}
     */
    addFiles(files) {
        files.forEach((f) => {
            this.add(f);
        });
        return this;
    }

    /**
     * starts the testRPC
     * instantiates the debug TestRPC
     * @author Sean Batzel
     * @public
     * @return{Debugger}
     */
    async run() {
        this.testRPC = new GanacheWrapper(this.logger, this.rpcOpts);
        this.vm = await this.testRPC.init();
        this.emit(events.ready);
        return this;
    }

    /**
     * deploys all contracts that will be debugged to testRPC
     * @public
     * @author Andrew Plaza
     * @return{Debugger}
     */
    async start() {
        const contracts = this.cManager.values();

        // deploy contracts in parallel
        await Promise.all(contracts.map(async (c) => {
            await c.deploy();
        }));
        return this;
    }

    /**
     * Toggle a breakpoint on or off
     * @author Sean Batzel
     * @author Andrew Plaza
     * @param {string} fp - the path of the contract the breakpoint belongs
     * @param {number} ln - line number of breakpoint to toggle
     * @public
     * @return{Debugger}
     */
    toggleBreakpoint(fp, ln) {
        const contracts = this.cManager.getBySource(fp);
        console.log(contracts[0].getSourceMap(ln));
        if (this.cManager.getBySource(fp).exists(ln)) {
            this.cManager.getBySource(fp).removeBreakpoint(ln);
        } else {
            this.cManager.getBySource(fp).addBreakpoint(ln);
        }
        return this;
    }

    /**
     * add breakpoints
     * if file breakpoint belongs to does not exist in manager,
     * it is created
     * @param{Object} breakpoints -
     * either an array of breakpoints (num) and the source code it belongs to (string) as
     * `[[1, 'source_file_x.sol'], [32, 'source_file_y.sol']]`
     * or as an object with an array of line numbers, and the source file
     * @return{Debugger}
     */
    addBreakpoints(breakpoints) {
        if (isDef(breakpoints.source) && isDef(breakpoints.lines)) {
            this.add(breakpoints.source);
            breakpoints.lines.forEach((lineNum) => {
                this.toggleBreakpoint(breakpoints.source, lineNum);
            });
        } else if (breakpoints instanceof Array) {
            breakpoints.forEach((bp) => {
                this.cManager.getBySource(bp[1]).addBreakpoint(bp[0]);
            });
        } else {
            throw new Error('Incorrect parameters passed to `addBreakpoints`');
        }
        console.log('breakpoints added: ${breakpoints}');
        return this;
    }

    /**
     * remove breakpoints
     * @param{Array<Array>} breakpoints - array of breakpoints and the source
     * code they belong to as:
     * `[[93, 'source_file_a'], [124, 'source_file_w']]`
     * @return{Debugger}
     */
    removeBreakpoints(breakpoints) {
        breakpoints.forEach((bp) => {
            this.cManager.getBySource(bp[1]).removeBreakpoints(bp[0]);
        });
        return this;
    }

    /**
     * clear breakpoints from all contracts
     */
    clearBreakpoints() {
        this.cManager.forEach((c) => {
            c.clearBreakpoints();
        })
    }

    /**
     * Debugger follows execution in function contexts.
     * @author Sean Batzel
     * @author Andrew Plaza
     * @public
     * @return{Debugger}
     */
    stepInto() {
        this.emit(events.stepInto);
        return this;
    }

    /**
     * Step Over operation (does not inspect/go into functions/library funcs)
     * @author Andrew Plaza
     * @public
     * @return{Debugger}
     */
    next() {
        this.emit(events.stepOver);
        return this;
    }

    /**
     * Listens for step events on the EVM
     * if a breakpoint is hit, it calls `hitBreakpoint` instance method
     * @private
     * @author Andrew Plaza
     * @return{Object}
     */
    events() {
        let deploying = false;

        /**
         * run when a breakpoint is hit in the EVM
         * @param {Object} evObj - memory, stack, address, account, etc from EVM
         * @private
         * @return{Debugger}
         */
        const hitBreakpoint = async (evObj) => {
            this.emit(events.VMBreakpoint, evObj);
            let next =
                await waitForEvents(this, [
                    events.stepOver, events.stepInto, events.continue,
                ]);
            return this;
        };

        const stepHook = async (eventObj, cb) => {
            this.logger.vmDebug(
                `Executing ${eventObj.opcode.name}. PC: ${eventObj.pc}`);

            const dbgAddr = eventObj.address.toString('hex');
            // we can't get the code of a contract that has not yet been deployed
            // so we only track code if 'deploy' is set
            let c = this.cManager.findByAssocAddr(dbgAddr);
            if (!isDef(c) &&
                !this.cManager.outliers.includes(dbgAddr)
                && !deploying) {
                c = await this.trackCode(dbgAddr);
                if (c) deploying = !deploying;
            }

            if (c instanceof Contract) {
                const srcLoc =
                    c.getSourceLocationFromPC(this.cManager.codeManager, eventObj.pc);
                if (isDef(srcLoc)) {
                    this.logger.vmDebug(
                        `line range: ${srcLoc.start}:${srcLoc.end}`
                    );
                    this.logger.vmDebug(
                        `source:
            ${c.getSource().substr(
                            srcLoc.map.start, srcLoc.map.start + srcLoc.map.length)}`);
                }
                if (
                    isDef(srcLoc) &&
                    c.exists(srcLoc.start)
                ) {
                    await hitBreakpoint({ breakpoint: srcLoc.start, eventObj });
                }
            }

            this.logger.vmDebug(
                `Executed ${eventObj.opcode.name}. PC: ${eventObj.pc}`);
            cb();
        };

        const afterTx = async (data, cb) => {
            // creation of an address means a contract has been deployed
            if (isDef(data.createdAddress)) deploying = !deploying;
            cb();
        };

        return {
            listen: () => {
                this.vm.on('step', stepHook);
                this.vm.on('afterTx', afterTx);
            },
            close: () => {
                this.removeListener('step', stepHook);
                this.removeListener('afterTx', afterTx);
            },
        };
    }

    /**
     * @author Andrew Plaza
     * adds a contract address and associates it with an
     * instantiated Contract object managed by cManager
     * if we do not manage a contract with the corresponding bytecode at the addr
     * it is added to an array of 'outliers'
     * @param{string} addr - hex string of address for which code we want to track
     * @return{bool|Contract} -
     *  - true if contract is being deployed
     *  - false if contract is deployed but not in the ContractManager,
     *  - Contract if deployed and in Manager
     * @private
     */
    async trackCode(addr) {
        const code = await Contract.getCode(
            addr,
            this.testRPC.getProvider(),
            { loggerLevel: this.logger.level }
        );
        if (code === '0x0') return true;
        const c = this.cManager.findByRuntimeBytecode(code);
        if (isDef(c)) {
            c.associate(addr);
            this.logger.vmDebug('associated!');
            return c;
        } else {
            this.cManager.outliers.push(addr);
            return false;
        }
    }

    /**
     * for testing purposes
     * slows down execution of the EVM to see what's happening in real time
     */
    doSomethingIntensive() {
        for (let i = 0; i < 30000000; i++) {

        }
    }
}

exports.default = Debugger;
module.exports = Debugger;
