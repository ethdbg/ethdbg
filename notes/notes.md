# Useful Wiki Links:

[Github Ethereum Development Tutorial]: https://github.com/ethereum/wiki/wiki/Ethereum-Development-Tutorial

- in-depth and low-level view of the EVM and solidity/assemblylang/bytecode

[Ethereum Subtleties]: https://github.com/ethereum/wiki/wiki/Subtleties

# Potentially Useful Libraries:

[ETH Contracts To Bytecode]: https://crates.io/crates/ethabi-contract
[Ethereum JSON-RPC Client]: https://crates.io/crates/web3
[TestRPC Tool]: https://crates.io/crates/sputnikvm-dev
[Generic Blockchain Interface]: https://crates.io/crates/blockchain
[Ethereum Virtual Machine]: https://crates.io/crates/evm
[Block and Transaction Types]: https://crates.io/crates/etcommon-block
[Shortcuts and Helper Functions for Hash  Functions]: https://crates.io/crates/etcommon-crypto



# Good-To-Know Abbreviations:

EOA: Externally Owned Account

- An account that is owned by a human, controlled by a private key. If you control the private key you have the ability to send ether and messages from it



## Notes:

### EVM

- The ethereum virtual machine is lifeless until acted on by an external force (EOA)
  - If the target of this external force is another EOA, only a transfer of ETH is possible and the EVM goes back to bed
  - if the target is a Contract, then the EVM lives for the duration of the contract and then goes back to bed

### Contracts
code on the blockchain

#### Creation
- once you have an unlocked account and some funds, you can create a contract on the blockchain by sending a transaction to the empty address with the EVM code as data. 
```
primaryAddress = eth.accounts[0]
MyContract = eth.contract(abi);
contact = MyContract.new(arg1, arg2, ..., {from: primaryAddress, data: evmCode})
```

- Binary data is serialized in hexadecimal form. Hex strings always have hex prefix 0x.
- arg1, arg2, ... are arguments for the contract constructor, in case it accepts any.
- requires you to pay for execution.  your balance on the account will be reduced according to the gas rules of the VM once your transaction makes it into a block. After some time, contract should appear included in a block confirming that the state it brought about is a consensus. Your contract now lives on the blockchain.










