// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "./Steady.sol";
import "./Unsteady.sol";

import "hardhat/console.sol";

interface ICGT {
    function transferFrom(
        address from,
        address to,
        uint256 value
    ) external returns (bool);
    
    function increaseAllowance(
        address spender, 
        uint256 addedValue
    ) external returns (bool);

    function balanceOf(address owner) 
    external 
    view 
    returns (uint256);
}

/// @title Split and Merge Fee on Transfer Token CGT
/// TODO: Add reentrancy guard
contract RootAlchemist is ReentrancyGuard {

    ICGT public CGT;
    Steady public steady;
    Unsteady public unsteady;
    address public priceOracle;

    uint256 public decimals = 8;

    event Split(address indexed source, uint256 splitAmount, int256 price);
    event Merge(address indexed source, uint256 mergedAmount, int256 price);

    struct TokenInfo {
        uint256 balance;
        uint256 amount;
    }

    constructor(
        address _CGT,
        address _Steady,
        address _Unsteady,
        address _priceOracle
    ) {
        CGT = ICGT(_CGT);
        steady = Steady(_Steady);
        unsteady = Unsteady(_Unsteady);
        priceOracle = _priceOracle; // 0x34BCe86EEf8516282FEE6B5FD19824163C2B5914;
    }

    /// @dev This splits an amount of CGT into two parts one is Steady tokens which is the 3/4 the token in dollar value
    /// @dev The rest is in Unsteady tokens which is 1/4th of the token in original form
    function splitCGT(uint256 amount) 
        external 
        nonReentrant() 
        returns (bool) 
    {
        require(amount >= 10); //minimum amount that can be split is 10 units or 0.0000001 Grams
        uint256 balanceOfSender = CGT.balanceOf(msg.sender);
        require(amount <= balanceOfSender, "You do not have enough CGT");

        //minimumn price of 0.00000001 and max price of 100000000000
        int256 price = priceFromOracle();

        uint256 scgtamt = (amount * 75 * uint256(price)) / 10000000000; // should have twice the amount of Steady.
        //transfer the CGT tokens to the splitter contract
        CGT.transferFrom(msg.sender, address(this), amount);
        steady.mint(msg.sender, scgtamt);
        unsteady.mint(msg.sender, (amount * 25 ) / 100 / 10 * 10);

        emit Split(msg.sender, amount, price);
        return true;
    }

    /// @notice This merges an amount of CGT from two parts one part Steady tokens and another Unsteady tokens
    /// @dev Pass in the total amount of CGT that you expect, it will increase the allowance accordingly
    function mergeCGT(uint256 cgtAmountToMerge) 
        external 
        nonReentrant() 
        returns (bool) 
    {
        require(cgtAmountToMerge >= 10); //minimum amount that can be merged is 10 units or 0.0000001 Grams

        TokenInfo memory unsteadyCGT;
        TokenInfo memory steadyCGT;

        int256 price = priceFromOracle();
       
        steadyCGT.amount = (cgtAmountToMerge * 75 * uint256(price)) / 10000000000;
        unsteadyCGT.amount = (cgtAmountToMerge * 25) / 100;
        steadyCGT.balance = Steady(steady).balanceOf(msg.sender);
        unsteadyCGT.balance = Unsteady(unsteady).balanceOf(msg.sender);

        require(unsteadyCGT.amount <= unsteadyCGT.balance, "Need more Unsteady");
        require(steadyCGT.amount <= steadyCGT.balance, "Need more Steady");
        //approve CGT from this address to the msg.sender
        CGT.increaseAllowance(msg.sender, cgtAmountToMerge);
        unsteady.burnFrom(msg.sender, unsteadyCGT.amount);
        steady.burnFrom(msg.sender, steadyCGT.amount);

        emit Merge(msg.sender, cgtAmountToMerge, price);
        return true;
    }

    /// @dev Oracle price for CGT utilizing chainlink
    function priceFromOracle() public view returns (int256 price) {
        bytes memory payload = abi.encodeWithSignature("getLatestPrice()");
        (, bytes memory returnData) = address(priceOracle).staticcall(payload);
        (price) = abi.decode(returnData, (int256));
        //minimumn price of 0.00000001 and max price of 1 Trillion
        require(price >= 1 && price <= 1000000000000000000000000000000, "Oracle price is out of range");
    }
}
