// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;


import "@openzeppelin/contracts-upgradeable/token/ERC20/presets/ERC20PresetMinterPauserUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/ClonesUpgradeable.sol";
import "./interfaces/ICHYME.sol";
import "./Alchemist.sol";
import "hardhat/console.sol";

contract AlchemistAcademy {
    address immutable elixirImplementation;
    address immutable steadyImplementation;
    address immutable alchemistImplementation;
    string steady = "Steady "; 
    string elixir = "Elixir "; 
    string steadySymbol = "S"; 
    string elixirSymbol = "E";
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    address alchemistDeployedAddress;
    
    constructor() {
        elixirImplementation = address(new ERC20PresetMinterPauserUpgradeable());
        steadyImplementation = address(new ERC20PresetMinterPauserUpgradeable());
        alchemistImplementation = address(new Alchemist());
    }

    function createElixir(string memory name, string memory symbol) internal returns (address) {
        address elixir = ClonesUpgradeable.clone(elixirImplementation);
        ERC20PresetMinterPauserUpgradeable(elixir).initialize(name, symbol);
        return elixir;
    }
    function createSteady(string memory name, string memory symbol) internal returns (address) {
        address steady = ClonesUpgradeable.clone(steadyImplementation);
        ERC20PresetMinterPauserUpgradeable(steady).initialize(name, symbol);
        return steady;
    }

    function alchemist(address _Chyme, address _priceOracle, string memory _symbol) external returns (address) {
        // string memory symbol  = ICHYME(_Chyme).symbol();
        string memory symbol  = _symbol;
        
        address _Steady = createSteady(string(abi.encodePacked(steady, symbol)), string(abi.encodePacked(steadySymbol, symbol)));
        address _Elixir = createElixir(string(abi.encodePacked(elixir, symbol)), string(abi.encodePacked(elixirSymbol, symbol)));

        address alchemistDeployed = ClonesUpgradeable.clone(alchemistImplementation);
        Alchemist(alchemistDeployed).initialize( 
           _Chyme,
           _Steady,
           _Elixir,
           _priceOracle);
        
        IAccessControlEnumerableUpgradeable(_Elixir).grantRole(MINTER_ROLE, alchemistDeployed);
        IAccessControlEnumerableUpgradeable(_Steady).grantRole(MINTER_ROLE, alchemistDeployed);

        alchemistDeployedAddress = alchemistDeployed;
        return alchemistDeployed;
    }

    function getLatestAlchemist() external view returns(address){
        return alchemistDeployedAddress;
    }
}