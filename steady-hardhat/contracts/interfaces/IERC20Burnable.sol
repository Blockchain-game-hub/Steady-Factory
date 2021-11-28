// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
interface IERC20Burnable {
    function mint(address to, uint256 amount) external;   
    function burnFrom(address account, uint256 amount) external;
    function balanceOf(address owner) external view returns (uint256);
}