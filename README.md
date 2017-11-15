# ethdbg
A Debugger for Ethereum Programming Languages

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

### Communication with Rust

Communicates to Rust through IPC. 
Pipes are used (Since this app will be cross-platform, 
pipes are preferred to sockets in this case as local Windows firewall may conflict with sockets)
-- Socket is used to awaken rust process from Javascript.


### Library Modifications

All modified client libraries are kept up to date with upstream.

Modifications to Ganache-Core:
- added forked (https://github.com/InsidiousMind/ethereumjs-vm) ethereumjs-vm to dependency
  - allows freezing execution of VM if needbe. For debugging purposes.
