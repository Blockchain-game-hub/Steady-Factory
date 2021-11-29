// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./FetchMerkleForLatestEpoch.sol";
import "./MerkleDistributor.sol";

interface KeeperCompatibleInterface {
    function checkUpkeep(bytes calldata checkData) external returns (bool upkeepNeeded, bytes memory performData);
    function performUpkeep(bytes calldata performData) external;
}


contract PrizeDistributionKeeper is KeeperCompatibleInterface, ChainlinkClient, Ownable {
    using Chainlink for Chainlink.Request;

    uint private creationBlock = block.number;
    address private merkleDistributor;
    address private fetchMerkle;
    bytes32 private jobId;

    constructor(address _merkleDistributor, address _fetchMerkle) {
      merkleDistributor = _merkleDistributor;
      fetchMerkle = _fetchMerkle;
    }

    function setJobId(bytes32 _jobId) external onlyOwner {
        jobId = _jobId;
    }

    /**
     *  @notice Check Upkeep called by keepers to check if upkeep is required
     */ 
     
    function checkUpkeep(bytes calldata checkData) external view override returns  (bool upkeepNeeded, bytes memory performData)   {
      if((block.number - creationBlock) % 100 == 0)
      {
        uint epochNumber = (block.number - creationBlock)/100;
        return (true, abi.encode(epochNumber));
      }
      else{
        return (false, checkData);
      }
    }

    /**
     * @notice Perform the upkeep required
     */ 
    function performUpkeep(bytes calldata performData) external override {
      //Here what we want to do is if the check upkeep returned true, set the merkleroothash for that epoch
      uint256 epochNumber;
      for(uint i=0;i<performData.length;i++){
            epochNumber = epochNumber + uint8(performData[i]);
      }

      //Triggering api contracts request method //commenting out for now coz no API in polygon mumbai
      // FetchMerkleForLatestEpoch(fetchMerkle).requestedLockedData("_pathOfValue",epochNumber);

      // (bool success, bytes memory callData) = address(fetchMerkle).staticcall(abi.encodeWithSignature("merkleHash()"));
      // require(success, "Unable to fetch merkle hash");
      // (bytes32 merkleRoot) = abi.decode(callData, (bytes32));
      
      // MerkleDistributor(merkleDistributor).setMerkleRootPerEpoch(merkleRoot, epochNumber-1);
      MerkleDistributor(merkleDistributor).setMerkleRootPerEpoch(0x0, epochNumber-1);
    }
}