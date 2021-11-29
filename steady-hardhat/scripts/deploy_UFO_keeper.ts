// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { Contract } from 'ethers';
import  { config, ethers } from "hardhat";
import { Wallet } from 'ethers';
import fs from 'fs';
import { PrizeDistributionContract , MerkleDistributor} from '../src/types/index';
import * as hre from "hardhat";

const UFO_TOKEN_ADDRESS = "0x249e38ea4102d0cf8264d3701f1a0e39c4f2dc3b";

let  nonDeployer: Wallet, deployer : Wallet;

// async function main() {
//     await verify("0x900f44a5eE9ADe16397C2163FE40E7B34176CaD0")
// }
async function main() {
  const accounts = await (ethers as any).getSigners()
  deployer = accounts[0];
  // fs.unlinkSync(`${config.paths.artifacts}/contracts/contractAddress.ts`);
  // const tokenFactory = await ethers.getContractFactory("SteadyDAOToken");
  // const token = await tokenFactory.deploy();
  // console.log("Deploying prizeDist contract...", prizeDist.address);
  
  const merkleDistFactory = await ethers.getContractFactory("MerkleDistributor");
  const merkleDist = await merkleDistFactory.deploy(UFO_TOKEN_ADDRESS);
  console.log("Deploying prizeDist contract...", merkleDist.address);

  const prizeDistFactory = await ethers.getContractFactory("PrizeDistributionContract");
  const prizeDist = await prizeDistFactory.deploy(merkleDist.address, merkleDist.address);//we put dummy for the api
  console.log("Deploying prizeDist contract...", prizeDist.address);


  return {'prizeDist':prizeDist.address, 'merkleDist':merkleDist.address}
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
    await delay(50000);
    await verify(deployedData.prizeDist, deployedData.merkleDist, deployedData.merkleDist);
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
