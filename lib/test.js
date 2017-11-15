#! /usr/bin/env node
const Contract = require("./contract.js");
const sleep = require("sleep");
const { fork } = require("child_process");

// going to need to spawn a child process and pass the evm
// from the forked server up to the debugger
function test() {
  console.log("Forking current testRPC...");
  try {
    this.forked_blockchain = fork('./fork.js');
  } catch(err) {
    console.log(err);
  }
  
  let success = false;
  let msg_count = 0;
  let fork_address = null;
  process.on('message', (msg) => {
    console.log("Received message!: " + msg);
    msg_count++;
    switch (msg_count) {
      case 1:
        if(msg == 1) { success = true; }
        else { process.exit(1); }
        console.log("Succesfully forked!");
        break;
      case 2:
        fork_address = msg;
      default:
        console.log("Could not decipher message");
    }
  });

  // wait for testRPC to go up
  console.log("Waiting for test RPC success...");
  while(success === false) { sleep.sleep(1); }

  let contract_instance = new Contract (
    'http://localhost:8545', 
    './../examples/example_solidity/simple.sol', 
    ':SimpleStorage'
  );

  contract_instance.deploy();
  sleep.sleep(5);
  contract_instance.test(contract => {
    let result = contract.get();
    console.log("Result");
    console.log(result);
  });
}

test();
