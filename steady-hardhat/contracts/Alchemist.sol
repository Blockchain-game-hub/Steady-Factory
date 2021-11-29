// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "./interfaces/ICHYME.sol";
import "./interfaces/IERC20Burnable.sol";

import "hardhat/console.sol";

/// @title Split and Merge Token Chyme
/// TODO: Add reentrancy guard
contract Alchemist is ReentrancyGuard, Initializable {

    ICHYME public Chyme;
    IERC20Burnable public steady;
    IERC20Burnable public elixir;
    address public steadyAddr;
    address public elixirAddr;
    address public priceOracle;
    address public sdtAddress;


    event Split(address indexed source, uint256 splitAmount, int256 price);
    event Merge(address indexed source, uint256 mergedAmount, int256 price);

    struct TokenInfo {
        uint256 balance;
        uint256 amount;
    }

    function initialize( address _Chyme,
        address _Steady,
        address _Elixir,
        address _priceOracle,
        address _steadyDaoToken) public initializer {
        __Alchemist_init(  _Chyme,
         _Steady,
         _Elixir,
         _priceOracle,
         _steadyDaoToken);
    }

    function __Alchemist_init(
        address _Chyme,
        address _Steady,
        address _Elixir,
        address _priceOracle,
        address _steadyDaoToken
    )  internal initializer {
        Chyme = ICHYME(_Chyme);
        steady = IERC20Burnable(_Steady);
        elixir = IERC20Burnable(_Elixir);
        steadyAddr = _Steady;
        elixirAddr = _Elixir;
        priceOracle = _priceOracle; // 0x34BCe86EEf8516282FEE6B5FD19824163C2B5914;
        sdtAddress = _steadyDaoToken;
    }

    function getSteadyAddr() public view returns(address) {
        return steadyAddr;
    }

    function getElixirAddr() public view returns(address) {
        return elixirAddr;
    }

    function getSdtAddr() public view returns(address) {
        return sdtAddress;
    }

    /// @dev This splits an amount of Chyme into two parts one is Steady tokens which is the 3/4 the token in dollar value
    /// @dev The rest is in Elixir tokens which is 1/4th of the token in original form
    function split(uint256 amount) 
        external 
        nonReentrant() 
        returns (bool) 
    {
        console.log("balance in contract:");
        require(amount >= 10); //minimum amount that can be split is 10 units or 0.0000001 Grams
        uint256 balanceOfSender = Chyme.balanceOf(msg.sender);
        require(amount <= balanceOfSender, "You do not have enough Chyme");

        //minimumn price of 0.00000001 and max price of 100000000000
        int256 price = priceFromOracle();

        uint256 sChymeamt = (amount * 75 * uint256(price)) / 10000000000; // should have twice the amount of Steady.
        //transfer the Chyme tokens to the splitter contract
        Chyme.transferFrom(msg.sender, address(this), amount);
        steady.mint(msg.sender, sChymeamt);
        elixir.mint(msg.sender, (amount * 25 ) / 100 / 10 * 10);

        // reward splitter with SDT
        ICHYME(sdtAddress).approve(msg.sender, 10);

        // Remove this
        console.log("STEADY ANSWER:: %s", sChymeamt);
        console.log("EXLIXIR ANSWER:: %s", (amount * 25 ) / 100 / 10 * 10);
        //
        emit Split(msg.sender, amount, price);
        return true;
    }

    /// @notice This merges an amount of Chyme from two parts one part Steady tokens and another Elixir tokens
    /// @dev Pass in the total amount of Chyme that you expect, it will increase the allowance accordingly
    function merge(uint256 ChymeAmountToMerge) 
        external 
        nonReentrant() 
        returns (bool) 
    {
        require(ChymeAmountToMerge >= 10); //minimum amount that can be merged is 10 units or 0.0000001 Grams

        TokenInfo memory __elixir;
        TokenInfo memory __steady;

        int256 price = priceFromOracle();
       
        __steady.amount = (ChymeAmountToMerge * 75 * uint256(price)) / 10000000000;
        __elixir.amount = (ChymeAmountToMerge * 25) / 100;
        __steady.balance = IERC20Burnable(steady).balanceOf(msg.sender);
        __elixir.balance = IERC20Burnable(elixir).balanceOf(msg.sender);

        require(__elixir.amount <= __elixir.balance, "Need more Elixir");
        require(__steady.amount <= __steady.balance, "Need more Steady");
        //approve Chyme from this address to the msg.sender
        Chyme.approve(msg.sender, ChymeAmountToMerge);
        // console.log("Burn Elixir: %s\nBurn Steady: %s", __elixir.amount, __steady.amount);
        console.log("alchI addr: %s", address(this));
        console.log("Tring to merge Steady: %s, ||  Elixir: %s", __steady.amount, __elixir.amount);
        elixir.burnFrom(msg.sender, __elixir.amount);
        steady.burnFrom(msg.sender, __steady.amount);

        emit Merge(msg.sender, ChymeAmountToMerge, price);
        return true;
    }

    /// @dev Oracle price for Chyme utilizing chainlink
    function priceFromOracle() public view returns (int256 price) {
        // bytes memory payload = abi.encodeWithSignature("getLatestPrice()");
        bytes memory payload = abi.encodeWithSignature("latestAnswer()");
        (, bytes memory returnData) = address(priceOracle).staticcall(payload);
        (price) = abi.decode(returnData, (int256));
        //minimumn price of 0.00000001 and max price of 1 Trillion
        require(price >= 1 && price <= 1000000000000000000000000000000, "Oracle price is out of range");
    }
}
