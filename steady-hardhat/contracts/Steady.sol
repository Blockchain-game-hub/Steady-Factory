// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Steady is ERC20, ERC20Burnable, Ownable {
    address public router;

    constructor() ERC20("SteadyCGT", "SCGT") {}

    /**
     * @dev Throws if called by any account other than the router.
     */
    modifier onlyAlchemist() {
        require(router == msg.sender, "Caller is not the alchemist");
        _;
    }

    function setAlchemist(address _router) public onlyOwner {
        router = _router;
    }

    function getAlchemist() public view returns (address) {
        return router;
    }

    function decimals() public pure override returns (uint8) {
        return 8;
    }

    function mint(address to, uint256 amount) external onlyAlchemist {
        _mint(to, amount);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        super._beforeTokenTransfer(from, to, amount);
    }
}
