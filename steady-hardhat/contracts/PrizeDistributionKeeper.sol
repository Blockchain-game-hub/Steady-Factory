// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

interface KeeperCompatibleInterface {
    function checkUpkeep(bytes calldata checkData) external returns (bool upkeepNeeded, bytes memory performData);
    function performUpkeep(bytes calldata performData) external;
}


contract PrizeDistributionContract is KeeperCompatibleInterface {
    constructor(address _merkleDistributor) {
      //here set the merkle distributor address
    }

    /**
     *  @notice Check Upkeep called by keepers to check if upkeep is required
     */ 
    function checkUpkeep(bytes calldata checkData) external view override returns  (bool upkeepNeeded, bytes memory performData)   {
        //here check whether an epoch is finished and  if anyone played? This can be done via an API call
      address wallet = abi.decode(checkData, (address));
      return (wallet.balance < 1 ether, bytes(""));
    }

    /**
     * @notice Perform the upkeep required
     */ 
    function performUpkeep(bytes calldata performData) external override {
      //Here what we want to do is if the check upkeep returned true, set the merkleroothash for that epoch
      address[] memory wallets = abi.decode(performData, (address[]));
      for (uint256 i = 0; i < wallets.length; i++) {
        payable(wallets[i]).transfer(1 ether);
      }
    }
}