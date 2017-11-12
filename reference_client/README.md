The frontend for the debugger is written in NodeJS. This is done for tighter integration with ethereumjs/testrpc, which is also writen in JS. Furthermore, ethereumJS testRPC provides more debugging tools, along with a '--fork' option (in addition to what is required by the spec) which makes this debugging tool possible.


The debug process looks like:

- Fork TestRPC with slightly modified testRPC + EVM, allowing for custom callback function
- once transaction which set off contract into action is made, a callback is triggered upon the first 'step' into this transaction (using EVM vm.on('step') event). 
- this callback triggers node code that falls into the Rust EthDbg library

all node provides are a few utility functions to make this possible. It also provides an easy-to-use interface most programmers are comfortable with, rather than learning Rust.
