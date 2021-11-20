pragma solidity ^0.8.0;

contract DummyPriceOracleForTesting {
int256 price;

  function getLatestPrice() public view returns(int256) {
    return price;
  }

  function setLatestPrice(int256 _price) public {
    price = _price;
  }

}