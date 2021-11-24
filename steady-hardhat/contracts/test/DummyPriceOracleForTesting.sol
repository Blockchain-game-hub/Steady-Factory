pragma solidity ^0.8.0;

contract DummyPriceOracleForTesting {
int256 price;
int256 public latestAnswer;

  function getLatestPrice() public view returns(int256) {
    return price;
  }

  function setLatestPrice(int256 _price) public {
    price = _price;
  }

  function setLatestAnswer(int256 _latestAnswer) public {
    latestAnswer = _latestAnswer;
  }
}