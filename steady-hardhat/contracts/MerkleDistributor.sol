// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IMerkleDistributor.sol";

contract MerkleDistributor is IMerkleDistributor, Ownable {
    address public immutable override token;

    // This is a packed array of booleans.
    mapping(uint256 => mapping(uint256 => uint256)) private claimedInEpoch;
    mapping(uint256 => bytes32) public merkleRootInEpoch;
    constructor(address token_) {
        token = token_;
        //Here we need to make it a mix of tokens?
    }

    function isClaimed(uint256 index, uint256 _epoch) public view override returns (bool) {
        uint256 claimedWordIndex = index / 256;
        uint256 claimedBitIndex = index % 256;
        uint256 claimedWord = claimedInEpoch[_epoch][claimedWordIndex];
        uint256 mask = (1 << claimedBitIndex);
        return claimedWord & mask == mask;
    }

    function _setClaimed(uint256 index, uint256 _epoch) private {
        uint256 claimedWordIndex = index / 256;
        uint256 claimedBitIndex = index % 256;
        claimedInEpoch[_epoch][claimedWordIndex] = claimedInEpoch[_epoch][claimedWordIndex] | (1 << claimedBitIndex);
    }

    function claim(
        uint256 index, 
        address account, 
        uint256 amount, 
        bytes32[] calldata merkleProof,
        uint256 _epoch) 
    external override {
        require(!isClaimed(index, _epoch), "MD: Drop already claimed.");
        require(account == msg.sender, "Claimer is a different account");

        // Verify the merkle proof.
        bytes32 node = keccak256(abi.encodePacked(index, account, amount));
        
        require(MerkleProof.verify(merkleProof, merkleRootInEpoch[_epoch], node), "MD: Invalid proof.");

        // Mark it claimed and send the token.
        _setClaimed(index, _epoch);
        require(IERC20(token).transfer(account, amount), "MD: Transfer failed.");

        emit Claimed(_epoch, index, account, amount);
    }

    ///dev add modifier to check that it is only Prize Distribution Contract
    function setMerkleRootPerEpoch(bytes32 _merkleRoot, uint256 _epoch) external {
        merkleRootInEpoch[_epoch] = _merkleRoot;
    }
}