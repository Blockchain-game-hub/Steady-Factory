// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { Contract } from 'ethers';
import  { config, ethers } from "hardhat";
import { Wallet } from 'ethers';
import fs from 'fs';
import { Steady, Unsteady, CacheGold, RootAlchemist } from '../src/types/index';
import * as hre from "hardhat";

const feeAddress = '0x3E924146306957bD453502e33B9a7B6AbA6e4D3a';
let  backedTreasury: Wallet, testAddress : Wallet;

async function main() {
    await verify("0x900f44a5eE9ADe16397C2163FE40E7B34176CaD0")
}
async function mainold() {
  const accounts = await (ethers as any).getSigners()
  backedTreasury = accounts[1];
  testAddress = accounts[0];
  // fs.unlinkSync(`${config.paths.artifacts}/contracts/contractAddress.ts`);

  const oracleAddress = await ethers.getContractFactory("GoldGramConvertorPriceConsumer");
  const _oracleAddress = await oracleAddress.deploy();
  console.log("Deploying GoldGramConvertorPriceConsumer...", _oracleAddress.address);

  const lockedGoldOracle = await ethers.getContractFactory("LockedGoldOracle");
  const _lockedGoldOracle = await lockedGoldOracle.deploy();
  console.log("Deploying lockedGoldOracle...", _lockedGoldOracle.address);
  await delay(50000);

  const cacheGold = await ethers.getContractFactory("CacheGold");
  const cgt = await cacheGold.deploy( 
    "0xBc92dcCe42e3bE7a636b80a28f19f63FF1a91088",
    backedTreasury.address,
    "0x84ba6405774911D566584c3F348326B43A2f6f7C", 
    "0x55073c1E0e75cFbfb49eb7178113645FBC80D2D1",
     _lockedGoldOracle.address);
     await delay(20000);

     //set some gold in locked gold oracle
     //mint new tokens into backed treasury

     console.log("Deploying cacheGold...", cgt.address);

  // const Token = await ethers.getContractFactory("CacheGold");
  // const cgt = await Token.deploy() as CacheGold;
  saveFrontendFiles(cgt, "cgt");

  /* Then deploy the wrapped/stable CGT */
  const _wrappedCGT = await ethers.getContractFactory("Steady");
  const scgt = await _wrappedCGT.deploy() as Steady;
  saveFrontendFiles(scgt, "Steady");
  /* Then deploy the leveraged CGT */
  const _variableCGT = await ethers.getContractFactory("Unsteady");
  const lcgt = await _variableCGT.deploy(feeAddress) as Unsteady;
  saveFrontendFiles(lcgt, "Unsteady");
  await delay(5000);

  /* Then deploy the RootAlchemist__factory CGT */
  const _rootCGTConvertor = await ethers.getContractFactory("RootAlchemist");
  const rootCGTConvertor = await _rootCGTConvertor.deploy(cgt.address, scgt.address, lcgt.address, _oracleAddress.address);
  await _lockedGoldOracle.lockAmount(ethers.utils.parseUnits("100000000", 8));
  await delay(50000);

  await cgt.addBackedTokens(ethers.utils.parseUnits("100000000", 8));

  // await cgt.addBackedTokens(ethers.utils.parseUnits("100", 8));
  await cgt.connect(backedTreasury).transfer(testAddress.address, ethers.utils.parseUnits("10", 8));

  await scgt.setAlchemist(rootCGTConvertor.address);
  await lcgt.setAlchemist(rootCGTConvertor.address);
  await lcgt.setFeeExempt(rootCGTConvertor.address);

  saveFrontendFiles(rootCGTConvertor, "RootAlchemist");
  return {'rootCGTConvertor':rootCGTConvertor.address,
  '_oracleAddress' : _oracleAddress.address,
  'cgt' : cgt.address,
  'scgt' : scgt.address,
  'lcgt' : lcgt.address
}
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
