// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
interface ICHYME {
    function transferFrom(
        address from,
        address to,
        uint256 value
    ) external returns (bool);
    
    function approve(
        address spender, 
        uint256 addedValue
    ) external returns (bool);

    function balanceOf(address owner) 
    external 
    view 
    returns (uint256);

    function symbol() external view returns (string memory);
}