# Useful Wiki Links:

[Github Ethereum Development Tutorial]: https://github.com/ethereum/wiki/wiki/Ethereum-Development-Tutorial

- in-depth and low-level view of the EVM and solidity/assemblylang/bytecode

[Ethereum Subtleties]: https://github.com/ethereum/wiki/wiki/Subtleties

# Potentially Useful Libraries:

[ETH Contracts To Bytecode]: https://crates.io/crates/ethabi-contract
[Generic Blockchain Interface]: https://crates.io/crates/blockchain
[Ethereum Virtual Machine]: https://crates.io/crates/evm
[Block and Transaction Types]: https://crates.io/crates/etcommon-block
[Solidity Grammar]: https://github.com/solidityj/solidity-antlr4
[Native Cross-Platform Rust-bindings to NodeJS]: https://github.com/neon-bindings/neon


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


### Debug Symbols

Source Mappings (Taken from solidity docs)
these source mappings will act as the 'debug symbols' for us. Or at least as much as they can.

Source Mappings

As part of the AST output, the compiler provides the range of the source code that is represented by the respective node in the AST. This can be used for various purposes ranging from static analysis tools that report errors based on the AST and debugging tools that highlight local variables and their uses.

Furthermore, the compiler can also generate a mapping from the bytecode to the range in the source code that generated the instruction. This is again important for static analysis tools that operate on bytecode level and for displaying the current position in the source code inside a debugger or for breakpoint handling.

Both kinds of source mappings use integer indentifiers to refer to source files. These are regular array indices into a list of source files usually called "sourceList", which is part of the combined-json and the output of the json / npm compiler.

The source mappings inside the AST use the following notation:

`s:l:f`

Where s is the byte-offset to the start of the range in the source file, l is the length of the source range in bytes and f is the source index mentioned above.

The encoding in the source mapping for the bytecode is more complicated: It is a list of s:l:f:j separated by ;. Each of these elements corresponds to an instruction, i.e. you cannot use the byte offset but have to use the instruction offset (push instructions are longer than a single byte). The fields s, l and f are as above and j can be either i, o or - signifying whether a jump instruction goes into a function, returns from a function or is a regular jump as part of e.g. a loop.

In order to compress these source mappings especially for bytecode, the following rules are used:

        If a field is empty, the value of the preceding element is used.
        If a : is missing, all following fields are considered empty.

This means the following source mappings represent the same information:

```
1:2:1;1:9:1;2:1:2;2:1:2;2:1:2

1:2:1;:9;2::2;;
```




