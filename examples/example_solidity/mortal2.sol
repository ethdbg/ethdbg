pragma solidity ^0.4.16;
contract mortal {
  address owner;
  function mortal() public {
    owner = msg.sender;
  }
  function kill() public {
    if (msg.sender == owner) selfdestruct(owner);
  }
  function arbitrary() public returns (uint z) {
           uint x;
           uint y;
           x = 1;
           y = 1;
           return x+y;
  }
}
