pragma solidity ^0.4.0;

contract SimpleStorage {
    uint storedData;

    function set(uint x) {
        storedData = x;
    }

    function get() constant returns (uint) {
        return storedData;
    }
}

contract Test {
  uint test;
  uint testPlusOne;

  function set(uint x) {
    test = x;
    testPlusOne = x + 1;
  }

  function get() constant returns (uint) {
    return test;
  }

  function getPlusOne() constant returns (uint) {
    return testPlusOne;
  }
}
