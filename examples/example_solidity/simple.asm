
======= simple.sol:SimpleStorage =======
EVM assembly:
{
   ".code" : [
      {
         "begin" : 25,
         "end" : 209,
         "name" : "PUSH",
         "value" : "60"
      },
      {
         "begin" : 25,
         "end" : 209,
         "name" : "PUSH",
         "value" : "40"
      },
      {
         "begin" : 25,
         "end" : 209,
         "name" : "MSTORE"
      },
      {
         "begin" : 25,
         "end" : 209,
         "name" : "CALLVALUE"
      },
      {
         "begin" : 25,
         "end" : 209,
         "name" : "ISZERO"
      },
      {
         "begin" : 25,
         "end" : 209,
         "name" : "PUSH [tag]",
         "value" : "1"
      },
      {
         "begin" : 25,
         "end" : 209,
         "name" : "JUMPI"
      },
      {
         "begin" : 25,
         "end" : 209,
         "name" : "PUSH",
         "value" : "0"
      },
      {
         "begin" : 25,
         "end" : 209,
         "name" : "DUP1"
      },
      {
         "begin" : 25,
         "end" : 209,
         "name" : "REVERT"
      },
      {
         "begin" : 25,
         "end" : 209,
         "name" : "tag",
         "value" : "1"
      },
      {
         "begin" : 25,
         "end" : 209,
         "name" : "JUMPDEST"
      },
      {
         "begin" : 25,
         "end" : 209,
         "name" : "PUSH #[$]",
         "value" : "0000000000000000000000000000000000000000000000000000000000000000"
      },
      {
         "begin" : 25,
         "end" : 209,
         "name" : "DUP1"
      },
      {
         "begin" : 25,
         "end" : 209,
         "name" : "PUSH [$]",
         "value" : "0000000000000000000000000000000000000000000000000000000000000000"
      },
      {
         "begin" : 25,
         "end" : 209,
         "name" : "PUSH",
         "value" : "0"
      },
      {
         "begin" : 25,
         "end" : 209,
         "name" : "CODECOPY"
      },
      {
         "begin" : 25,
         "end" : 209,
         "name" : "PUSH",
         "value" : "0"
      },
      {
         "begin" : 25,
         "end" : 209,
         "name" : "RETURN"
      }
   ],
   ".data" : {
      "0" : {
         ".auxdata" : "a165627a7a72305820ba44ac833c2194f6e5c08f1cc1cb35fc6d6e2e8d99ff2d48c2588dede540ab470029",
         ".code" : [
            {
               "begin" : 25,
               "end" : 209,
               "name" : "PUSH",
               "value" : "60"
            },
            {
               "begin" : 25,
               "end" : 209,
               "name" : "PUSH",
               "value" : "40"
            },
            {
               "begin" : 25,
               "end" : 209,
               "name" : "MSTORE"
            },
            {
               "begin" : 25,
               "end" : 209,
               "name" : "PUSH",
               "value" : "4"
            },
            {
               "begin" : 25,
               "end" : 209,
               "name" : "CALLDATASIZE"
            },
            {
               "begin" : 25,
               "end" : 209,
               "name" : "LT"
            },
            {
               "begin" : 25,
               "end" : 209,
               "name" : "PUSH [tag]",
               "value" : "1"
            },
            {
               "begin" : 25,
               "end" : 209,
               "name" : "JUMPI"
            },
            {
               "begin" : 25,
               "end" : 209,
               "name" : "PUSH",
               "value" : "0"
            },
            {
               "begin" : 25,
               "end" : 209,
               "name" : "CALLDATALOAD"
            },
            {
               "begin" : 25,
               "end" : 209,
               "name" : "PUSH",
               "value" : "100000000000000000000000000000000000000000000000000000000"
            },
            {
               "begin" : 25,
               "end" : 209,
               "name" : "SWAP1"
            },
            {
               "begin" : 25,
               "end" : 209,
               "name" : "DIV"
            },
            {
               "begin" : 25,
               "end" : 209,
               "name" : "PUSH",
               "value" : "FFFFFFFF"
            },
            {
               "begin" : 25,
               "end" : 209,
               "name" : "AND"
            },
            {
               "begin" : 25,
               "end" : 209,
               "name" : "DUP1"
            },
            {
               "begin" : 25,
               "end" : 209,
               "name" : "PUSH",
               "value" : "60FE47B1"
            },
            {
               "begin" : 25,
               "end" : 209,
               "name" : "EQ"
            },
            {
               "begin" : 25,
               "end" : 209,
               "name" : "PUSH [tag]",
               "value" : "2"
            },
            {
               "begin" : 25,
               "end" : 209,
               "name" : "JUMPI"
            },
            {
               "begin" : 25,
               "end" : 209,
               "name" : "DUP1"
            },
            {
               "begin" : 25,
               "end" : 209,
               "name" : "PUSH",
               "value" : "6D4CE63C"
            },
            {
               "begin" : 25,
               "end" : 209,
               "name" : "EQ"
            },
            {
               "begin" : 25,
               "end" : 209,
               "name" : "PUSH [tag]",
               "value" : "3"
            },
            {
               "begin" : 25,
               "end" : 209,
               "name" : "JUMPI"
            },
            {
               "begin" : 25,
               "end" : 209,
               "name" : "tag",
               "value" : "1"
            },
            {
               "begin" : 25,
               "end" : 209,
               "name" : "JUMPDEST"
            },
            {
               "begin" : 25,
               "end" : 209,
               "name" : "PUSH",
               "value" : "0"
            },
            {
               "begin" : 25,
               "end" : 209,
               "name" : "DUP1"
            },
            {
               "begin" : 25,
               "end" : 209,
               "name" : "REVERT"
            },
            {
               "begin" : 76,
               "end" : 128,
               "name" : "tag",
               "value" : "2"
            },
            {
               "begin" : 76,
               "end" : 128,
               "name" : "JUMPDEST"
            },
            {
               "begin" : 76,
               "end" : 128,
               "name" : "CALLVALUE"
            },
            {
               "begin" : 76,
               "end" : 128,
               "name" : "ISZERO"
            },
            {
               "begin" : 76,
               "end" : 128,
               "name" : "PUSH [tag]",
               "value" : "4"
            },
            {
               "begin" : 76,
               "end" : 128,
               "name" : "JUMPI"
            },
            {
               "begin" : 76,
               "end" : 128,
               "name" : "PUSH",
               "value" : "0"
            },
            {
               "begin" : 76,
               "end" : 128,
               "name" : "DUP1"
            },
            {
               "begin" : 76,
               "end" : 128,
               "name" : "REVERT"
            },
            {
               "begin" : 76,
               "end" : 128,
               "name" : "tag",
               "value" : "4"
            },
            {
               "begin" : 76,
               "end" : 128,
               "name" : "JUMPDEST"
            },
            {
               "begin" : 76,
               "end" : 128,
               "name" : "PUSH [tag]",
               "value" : "5"
            },
            {
               "begin" : 76,
               "end" : 128,
               "name" : "PUSH",
               "value" : "4"
            },
            {
               "begin" : 76,
               "end" : 128,
               "name" : "DUP1"
            },
            {
               "begin" : 76,
               "end" : 128,
               "name" : "DUP1"
            },
            {
               "begin" : 76,
               "end" : 128,
               "name" : "CALLDATALOAD"
            },
            {
               "begin" : 76,
               "end" : 128,
               "name" : "SWAP1"
            },
            {
               "begin" : 76,
               "end" : 128,
               "name" : "PUSH",
               "value" : "20"
            },
            {
               "begin" : 76,
               "end" : 128,
               "name" : "ADD"
            },
            {
               "begin" : 76,
               "end" : 128,
               "name" : "SWAP1"
            },
            {
               "begin" : 76,
               "end" : 128,
               "name" : "SWAP2"
            },
            {
               "begin" : 76,
               "end" : 128,
               "name" : "SWAP1"
            },
            {
               "begin" : 76,
               "end" : 128,
               "name" : "POP"
            },
            {
               "begin" : 76,
               "end" : 128,
               "name" : "POP"
            },
            {
               "begin" : 76,
               "end" : 128,
               "name" : "PUSH [tag]",
               "value" : "6"
            },
            {
               "begin" : 76,
               "end" : 128,
               "name" : "JUMP"
            },
            {
               "begin" : 76,
               "end" : 128,
               "name" : "tag",
               "value" : "5"
            },
            {
               "begin" : 76,
               "end" : 128,
               "name" : "JUMPDEST"
            },
            {
               "begin" : 76,
               "end" : 128,
               "name" : "STOP"
            },
            {
               "begin" : 134,
               "end" : 207,
               "name" : "tag",
               "value" : "3"
            },
            {
               "begin" : 134,
               "end" : 207,
               "name" : "JUMPDEST"
            },
            {
               "begin" : 134,
               "end" : 207,
               "name" : "CALLVALUE"
            },
            {
               "begin" : 134,
               "end" : 207,
               "name" : "ISZERO"
            },
            {
               "begin" : 134,
               "end" : 207,
               "name" : "PUSH [tag]",
               "value" : "7"
            },
            {
               "begin" : 134,
               "end" : 207,
               "name" : "JUMPI"
            },
            {
               "begin" : 134,
               "end" : 207,
               "name" : "PUSH",
               "value" : "0"
            },
            {
               "begin" : 134,
               "end" : 207,
               "name" : "DUP1"
            },
            {
               "begin" : 134,
               "end" : 207,
               "name" : "REVERT"
            },
            {
               "begin" : 134,
               "end" : 207,
               "name" : "tag",
               "value" : "7"
            },
            {
               "begin" : 134,
               "end" : 207,
               "name" : "JUMPDEST"
            },
            {
               "begin" : 134,
               "end" : 207,
               "name" : "PUSH [tag]",
               "value" : "8"
            },
            {
               "begin" : 134,
               "end" : 207,
               "name" : "PUSH [tag]",
               "value" : "9"
            },
            {
               "begin" : 134,
               "end" : 207,
               "name" : "JUMP"
            },
            {
               "begin" : 134,
               "end" : 207,
               "name" : "tag",
               "value" : "8"
            },
            {
               "begin" : 134,
               "end" : 207,
               "name" : "JUMPDEST"
            },
            {
               "begin" : 134,
               "end" : 207,
               "name" : "PUSH",
               "value" : "40"
            },
            {
               "begin" : 134,
               "end" : 207,
               "name" : "MLOAD"
            },
            {
               "begin" : 134,
               "end" : 207,
               "name" : "DUP1"
            },
            {
               "begin" : 134,
               "end" : 207,
               "name" : "DUP3"
            },
            {
               "begin" : 134,
               "end" : 207,
               "name" : "DUP2"
            },
            {
               "begin" : 134,
               "end" : 207,
               "name" : "MSTORE"
            },
            {
               "begin" : 134,
               "end" : 207,
               "name" : "PUSH",
               "value" : "20"
            },
            {
               "begin" : 134,
               "end" : 207,
               "name" : "ADD"
            },
            {
               "begin" : 134,
               "end" : 207,
               "name" : "SWAP2"
            },
            {
               "begin" : 134,
               "end" : 207,
               "name" : "POP"
            },
            {
               "begin" : 134,
               "end" : 207,
               "name" : "POP"
            },
            {
               "begin" : 134,
               "end" : 207,
               "name" : "PUSH",
               "value" : "40"
            },
            {
               "begin" : 134,
               "end" : 207,
               "name" : "MLOAD"
            },
            {
               "begin" : 134,
               "end" : 207,
               "name" : "DUP1"
            },
            {
               "begin" : 134,
               "end" : 207,
               "name" : "SWAP2"
            },
            {
               "begin" : 134,
               "end" : 207,
               "name" : "SUB"
            },
            {
               "begin" : 134,
               "end" : 207,
               "name" : "SWAP1"
            },
            {
               "begin" : 134,
               "end" : 207,
               "name" : "RETURN"
            },
            {
               "begin" : 76,
               "end" : 128,
               "name" : "tag",
               "value" : "6"
            },
            {
               "begin" : 76,
               "end" : 128,
               "name" : "JUMPDEST"
            },
            {
               "begin" : 120,
               "end" : 121,
               "name" : "DUP1"
            },
            {
               "begin" : 107,
               "end" : 117,
               "name" : "PUSH",
               "value" : "0"
            },
            {
               "begin" : 107,
               "end" : 121,
               "name" : "DUP2"
            },
            {
               "begin" : 107,
               "end" : 121,
               "name" : "SWAP1"
            },
            {
               "begin" : 107,
               "end" : 121,
               "name" : "SSTORE"
            },
            {
               "begin" : 107,
               "end" : 121,
               "name" : "POP"
            },
            {
               "begin" : 76,
               "end" : 128,
               "name" : "POP"
            },
            {
               "begin" : 76,
               "end" : 128,
               "name" : "JUMP",
               "value" : "[out]"
            },
            {
               "begin" : 134,
               "end" : 207,
               "name" : "tag",
               "value" : "9"
            },
            {
               "begin" : 134,
               "end" : 207,
               "name" : "JUMPDEST"
            },
            {
               "begin" : 167,
               "end" : 171,
               "name" : "PUSH",
               "value" : "0"
            },
            {
               "begin" : 190,
               "end" : 200,
               "name" : "DUP1"
            },
            {
               "begin" : 190,
               "end" : 200,
               "name" : "SLOAD"
            },
            {
               "begin" : 183,
               "end" : 200,
               "name" : "SWAP1"
            },
            {
               "begin" : 183,
               "end" : 200,
               "name" : "POP"
            },
            {
               "begin" : 134,
               "end" : 207,
               "name" : "SWAP1"
            },
            {
               "begin" : 134,
               "end" : 207,
               "name" : "JUMP",
               "value" : "[out]"
            }
         ]
      }
   }
}

