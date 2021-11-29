// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FetchMerkleForLatestEpoch is ChainlinkClient, Ownable {
    using Chainlink for Chainlink.Request;
    
    // Private variable naming convention as per template contract
    address private oracle;
    bytes32 private jobId;
    uint256 private fee;
    string private api_endpoint;

    //this has to be later pushed into the MerkleDistributor.sol so needs to be an epoch -> hash mapping
    bytes32 public merkleHash;
    /**
     * @dev set the initial oracle and job ID
     * @param _oracle This is the address of the oracle registered with chainlink
     * @param _jobId This is the jobid from the list of jobs available in our case it is a HTTP GET request
     */ 
    constructor(address _oracle, bytes32 _jobId) {
        setChainlinkToken(0x326C977E6efc84E512bB9C30f76E30c160eD06FB);
        oracle = _oracle;
        jobId = _jobId;
        fee = 0.1 * 10 ** 18; // 0.1 LINK
    }

    function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len;
        while (_i != 0) {
            k = k-1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }

    function setAPIEndpoint(string memory _api_endpoint) external onlyOwner {
        api_endpoint = _api_endpoint;
    }

    /**
     * Set oracle address locally
     * @dev Since we use sendChainlinkRequestTo instead of sendChainlinkRequest we set this locally
     * @param _oracle  This is the address of the oracle registered with chainlink
     */ 
    function setOracle(address _oracle) external onlyOwner {
        require(_oracle != address(0)); //Check that it is not the zeroth address
        oracle = _oracle;
    }
    
    /**
     * Set fees, this is the fees that is paid in tribute to the service offered
     * @param _fee the fee in uint256 here it should be 0.01 Link
     */ 
    function setFees(uint256 _fee) external onlyOwner {
        require(_fee > 0);
        fee = _fee;
    }

    /**
     * Set the job id
     * @param _jobId This is the jobid from the list of jobs available in our case it is a HTTP GET request
     */ 
    function setJobId(bytes32 _jobId) external onlyOwner {
        jobId = _jobId;
    }

    /**
     * Get the oracle
     * @return oracleAddress 
     */ 
    function getOracle() external view returns(address oracleAddress) {
        return oracle;
    }

    /**
     * Get the feeAmount that is in LINK tokens
     * @return feeAmount
     */ 
    function getFees() external view returns(uint256 feeAmount) {
        return fee;
    }

    /**
     * Get the jobId
     * @return jobIdentifier
     */ 
    function getJobId() external view returns(bytes32 jobIdentifier) {
        return jobId;
    }

    /**
     * Receive the response in the form of requestId
     * @dev Kept pathOfValue as dynamic in case the path changes in future or we want to accomodate more in the same link
     * @param _pathOfValue This is the path of the value in the json object response in the url
     */ 
    function requestedData(string memory _pathOfValue, uint _epochNumber) public returns (bytes32 requestId) 
    {
        require(bytes(_pathOfValue).length != 0, "Requested path is not valid");
        
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
        
        // use 8 decimals for Cache Gold Token
        request.add("get", string(abi.encodePacked(api_endpoint, uint2str(_epochNumber))));
        request.add("path", _pathOfValue);
        
        // Sends the request
        requestId = sendChainlinkRequestTo(oracle, request, fee);
        return requestId;
    }
    
    /**
     * Fulfill the http request by the chainlink oracle
     * @param _requestId This is the request ID that was created in requestedLockedData
     * @param _merkleHash This is the hash of the requested root
     */ 
    function fulfill(bytes32 _requestId, bytes32 _merkleHash) public recordChainlinkFulfillment(_requestId)
    {
        merkleHash = _merkleHash;
    }

    /**
     * An option to withdraw LINK tokens in case of emergency
     */ 
    function withdrawLINK() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        require(link.transfer(msg.sender, link.balanceOf(address(this))), "Unable to transfer");
    }
    
}