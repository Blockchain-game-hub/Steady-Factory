/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomiclabs/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "Ownable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Ownable__factory>;
    getContractFactory(
      name: "Pausable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Pausable__factory>;
    getContractFactory(
      name: "ERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20__factory>;
    getContractFactory(
      name: "ERC20Burnable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20Burnable__factory>;
    getContractFactory(
      name: "IERC20Metadata",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Metadata__factory>;
    getContractFactory(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20__factory>;
    getContractFactory(
      name: "CacheGold",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.CacheGold__factory>;
    getContractFactory(
      name: "DummyPriceOracleForTesting",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DummyPriceOracleForTesting__factory>;
    getContractFactory(
      name: "LockedGoldOracle",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.LockedGoldOracle__factory>;
    getContractFactory(
      name: "ICGT",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ICGT__factory>;
    getContractFactory(
      name: "RootAlchemist",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.RootAlchemist__factory>;
    getContractFactory(
      name: "Steady",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Steady__factory>;
    getContractFactory(
      name: "Unsteady",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Unsteady__factory>;
    getContractFactory(
      name: "Context",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Context__factory>;
    getContractFactory(
      name: "Ownable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Ownable__factory>;
    getContractFactory(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20__factory>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.utils.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
  }
}