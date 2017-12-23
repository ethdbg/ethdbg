pragma solidity 0.4.18;

import "testC2.sol"

contract greeter is mortal {
    /* Define variable greeting of the type string */
    string greeting;
    
    /* This runs when the contract is executed */
    function greeter(string _greeting) public {
        greeting = _greeting;
    }

    /* Main function */
    function greet() constant returns (string) {
        uint x;
        uint y;
        uint z;
        uint a;
        uint b;
        x = 230;
        y = 4;
        z = x + y;
        a = x * y;
        b = x / y;
        b = a - 10;
        return greeting;
    }
}
