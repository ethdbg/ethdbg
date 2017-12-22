# ethdbg
A Debugger for Ethereum Programming Languages

[![Build Status](https://travis-ci.com/InsidiousMind/ethdbg.svg?token=Cyz989enSen8PDapyqs5&branch=master)](https://travis-ci.com/InsidiousMind/ethdbg)
### What is Ethereum Debug?
The Ethereum debug library is a fast, event-driven, multi-process debugging library which gives the developers the functionality
they need to create a debugger.
Our Debuggers: 
- VSCode ethdbg Extension <Link to VSCode extension>
- Reference CLI Debugger (inspired by gdb) <Link To Reference Implementation>

### General Notes
- TestRPC depends upon Ganache-core which depends upon ethereumjs-vm (the EVM we will be modifying with callback)

The frontend for the debugger is written in NodeJS. This is done for tighter integration with ethereumjs/testrpc, which is also writen in JS. Furthermore, ethereumJS testRPC provides more debugging tools, along with a '--fork' option (in addition to what is required by the spec) which makes this debugging tool possible.


The debug process looks like:
- (you) Set breakpoints in Solidity Code
- (you) Drop into 'Debug' mode, which, redirecting your contracts to be deployed to custom TestRPC(change provider to 8546)
- (we) Fork your(8545) TestRPC or create a new TestRPC testRPC + EVM, allowing for custom debug functionality
- (you) Run your tests
- when a breakpoint is hit, the execution of the EVM is frozen and you can inspect variables, stack, memory, etc
- (you) step in, step out, continue, etc
- (we) match up the EVM Bytecode to your source code, in EVM or through the reference CLI debugger interface
- (you) are able to debug your smart contracts!

### Actions that client library provides:
- Step in, Step Out, Deploy Smart Contracts, Run Solidity Code, set Breakpoints, get Breakpoints
- API Docs: <Link To API Documentation>

### Generating Documentation
- to generate developer documentation (including private classes) `npm run docgen`
- to generate documentation for use as debug library, `npm run docgen_prod`


### General TODO:
- cleanup README/documentation old unecessary files
- add examples of using the functions provided
- make sure docstrings are all correct, and formatted nicely
- move typescript declarations to seperate file

### This Wouldn't Happen without:
Thanks to [yann300](https://github.com/yann300), whose `astWalker.js`,
`source_map_decoder.js`, and `util.js` we modified for use in this project.
- make all classes be 'logger first'. IE, the logger should always be the first parameter to the class constructor
- Thanks to the people who created the Remix IDE, for providing some tools necessary to create this debugger

Additional thanks to [raineorshine](https://github.com/raineorshine) whose Solidity REPL process forms the core of arbitrary code execution.

### How To Contribute
- Read the Contribution Guidelines <Link to Contribution Guidelines Here>

If you would like to donate to this project and support the contributors,
please send your ETH or ERC20 tokens to `insidious.eth`
