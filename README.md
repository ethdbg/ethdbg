# ethdbg
A Debugger for Ethereum Programming Languages

[![Build Status](https://travis-ci.com/InsidiousMind/ethdbg.svg?token=Cyz989enSen8PDapyqs5&branch=master)](https://travis-ci.com/InsidiousMind/ethdbg)

### General Notes
- TestRPC depends upon Ganache-core which depends upon ethereumjs-vm (the EVM we will be modifying with callback)

The frontend for the debugger is written in NodeJS. This is done for tighter integration with ethereumjs/testrpc, which is also writen in JS. Furthermore, ethereumJS testRPC provides more debugging tools, along with a '--fork' option (in addition to what is required by the spec) which makes this debugging tool possible.


The debug process looks like:

- Fork TestRPC with slightly modified testRPC + EVM, allowing for custom callback function
- once transaction which set off contract into action is made, a callback is triggered upon the first 'step' into this transaction (using EVM vm.on('step') event).
- this callback triggers node code that falls into the Rust EthDbg library

all node provides are a few utility functions to make this possible. It also provides an easy-to-use interface most programmers are comfortable with, rather than learning Rust.


### Actions that client library provides (for rust):

- Fork running testRPC
- get event information (vm.on('step'))
- get an instance of the EVM from Ganache (ethereumjs-vm)


### Library Modifications

All modified client libraries are kept up to date with upstream.

Modifications to Ganache-Core:
- added forked (https://github.com/InsidiousMind/ethereumjs-vm) ethereumjs-vm to dependency
  - allows freezing execution of VM if needbe. For debugging purposes.


### General TODO:
- edit code to follow new eslint style (google style + eslint rec)

Thanks to [yann300](https://github.com/yann300), whose `astWalker.js`,
`source_map_decoder.js`, and `util.js` we modified for use in this project.
- make all classes be 'logger first'. IE, the logger should always be the first parameter to the class constructor
