#! /usr/bin/env node
const fork = require("./fork.js");
const Contract = require("./contract.js");
const sleep = require("sleep");


// going to need to spawn a child process and pass the evm
// from the forked server up to the debugger
function test() {
  console.log("Forking current testRPC...");

  this.evm = null;
  try {
    fork((evm) => {
      console.log("we never get here do we");
      this.evm = evm;
    });
  } catch(err) {
    console.log(err);
  }

  console.log("Fork Succeeded");
  console.log("EVM: " + this.evm);
  
  console.log("Blocking until evm is no longer null");
  while(this.evm === null )  {
  }

  console.log("EVM is no longer null!");

  let contract_instance = new Contract(
    'http://localhost:8545', 
    './../examples/example_solidity/simple.sol', 
    ':SimpleStorage'
  );
  contract_instance.deploy();

  this.evm.on('step', () => {
    console.log("Executed something!");
  })

  contract_instance.test(contract => {
    let result = contract.get();
    console.log(result);
  });
}
test();
