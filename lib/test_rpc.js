#! /usr/bin/env node
const Contract = require("./contract.js");
const sleep = require("sleep");
const { fork } = require("child_process");
const { EventEmitter } = require("events");

/**
 * @author Andrew Plaza
 * Interact with Forked TestRPC object
 */
class TestRPC {
  /**
   *@author Andrew Plaza
   *  @param{location} location of testRPC
   *  @param{contract} contract path
   *  @param{contract_name} name of the contract
   */
  constructor(location, contract, contract_name) {
    this.location = location;
    this.contract = contract;
    this.contract_name = contract_name;
    this.forked_blockchain = null;
    this.fork_address = null;
    this.success = false;
    this.readyEvent = new EventEmitter();
    
    // attach an event emmitter object to the node child process
    // for the purpose of telling us when the forked testRPC is ready
    try {
      this.forked_blockchain = fork('./fork.js');
    } catch ( err ) {
      throw new Error("Error forking blockchain: ", err);
      console.error("Exiting...");
      process.exit(1);
    }
  }

  init_events() {

    this.success = false;
    let msg_count = 0;
    this.forked_blockchain.on('message', (msg) => {
      /* console.log("Received message!: ", msg);
       * Init goes like this
       * |----------------------------------------|
       * | TestRPC  | Dir |   Fork     | msg_num  |
       * |----------------------------------------|
       * |  recv     <=     1          |     1    |
       * |  recv     <=     fork_addr  |     1    | (Address of forked TestRPC)
       * |  send     =>     1          |     2    |
       * |  ready    <=     'ready'    |     3    |
       * ------------------------------------------
      */
      msg_count++;
      switch (msg_count) {
        case 1:
          if(msg === 1) { this.success = true; }
          else { process.exit(1); }  // TODO: should throw error
          console.log("Succesfully forked!");
          break;
        case 2:
          console.log("Got Fork Address!");
          this.fork_address = msg;
          this.forked_blockchain.send(1);
          break;
        case 3:
          console.log("Emitting Ready Event!");
          this.readyEvent.emit('ready');
          break;
        default:
          console.log("Could not decipher message"); // TODO: Should throw error
      }
    });

    this.forked_blockchain.on('exit', (code) => {
      console.log("Forked Blockchain Exited with an exit code of: ", code);
    });

    this.forked_blockchain.on('error', (err) => {
      console.log("Forked Blockchain exited due to: ", err);
    });
  }
 
  run_contract() {
    // once the forked blockchain is ready to be deployed to, deploy contract
    this.readyEvent.on('ready', () => {
      let contract = new Contract (this.fork_address, this.contract, ":" + this.contract_name);
      contract.deploy();
      contract.test(c => {
        let result = c.get();
        console.log("Result");
        console.log(result);
      });
    });
  }
}

function test_rpc() {
  
  let test = new TestRPC(
    "http://localhost:8545", 
    "./../examples/example_solidity/simple.sol", 
    "SimpleStorage"
  );

  test.init_events();
  test.run_contract();
}

test_rpc();
