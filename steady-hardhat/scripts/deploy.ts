// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { Contract } from 'ethers';
import  { config, ethers } from "hardhat";
import { Wallet } from 'ethers';
import fs from 'fs';
import { Alchemist, AlchemistAcademy } from '../src/types/index';
import * as hre from "hardhat";

const feeAddress = '0x3E924146306957bD453502e33B9a7B6AbA6e4D3a';
let  backedTreasury: Wallet, testAddress : Wallet;

async function main() {
  const AlchemistAcademy = await ethers.getContractFactory("AlchemistAcademy");
  const academy = await AlchemistAcademy.deploy(
    { gasLimit: 11250000 }
  );
  await academy.deployed();
  console.log("Academy deployed to:", academy.address);
  console.log("Now verifying...");
  await verify(academy.address);
  console.log("Verified!");
  return academy.address;
}

async function verify(contractAddress:string, ...args:Array<any>) {
  console.log("verifying", contractAddress, ...args);
  await hre.run("verify:verify", {
    address: contractAddress,
    constructorArguments: [
      ...args
    ],
  });
}

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then( async (deployedData) => {
    // await delay(50000);
    // await verify(deployedData.rootCGTConvertor,
    //   deployedData.cgt, deployedData.scgt,
    //   deployedData.lcgt, deployedData._oracleAddress); //Verify the master contract
    // await verify(deployedData._oracleAddress)

    process.exit(0)
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

  function saveFrontendFiles(contract: Contract, contractName: string) {
    console.log('Adding to frontend',contractName)
    fs.appendFileSync(
      `${config.paths.artifacts}/contracts/contractAddress.ts`,
      `export const ${contractName} = '${contract.address}'\n`
    );
  }
