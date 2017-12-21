pragma solidity ^0.4.16;

contract mortal {

    address owner;

    function mortal() {
        owner = msg.sender;
    }
 
    function kill() {
        if (msg.sender == owner)
            selfdestruct(owner);
    }
}
