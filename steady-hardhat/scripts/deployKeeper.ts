// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { Contract } from 'ethers';
import  { config, ethers } from "hardhat";
import { Wallet } from 'ethers';
import fs from 'fs';
import { 
  FetchMerkleForLatestEpoch,
  PrizeDistributionKeeper, 
  MerkleDistributor
} from '../src/types/index';
import * as hre from "hardhat";

const STEADY_DAO_TOKEN_ADDRESS = "0x738C763dC38751Fc870a1B24ab23a7A36591005C";
const oracleAddress = "0x0bDDCD124709aCBf9BB3F824EbC61C87019888bb";
const jobId = "0x6336613030366534663438343437353461363532343434356163646538346130"; 

let  nonDeployer: Wallet, deployer : Wallet;

// async function main() {
//     await verify("0x900f44a5eE9ADe16397C2163FE40E7B34176CaD0")
// }
async function main() {
  const accounts = await (ethers as any).getSigners()
  deployer = accounts[0];
  
  const merkleDistFactory = await ethers.getContractFactory("MerkleDistributor");
  const merkleDist = await merkleDistFactory.deploy(STEADY_DAO_TOKEN_ADDRESS);
  console.log("Deploying merkleDistFactory contract...", merkleDist.address);

  const prizeDistFactory = await ethers.getContractFactory("PrizeDistributionKeeper");
  const prizeDist = await prizeDistFactory.deploy(merkleDist.address, merkleDist.address);//we put dummy for the api
  console.log("Deploying prizeDist contract...", prizeDist.address);

  const fetchMerkleForLatestEpochFactory = await ethers.getContractFactory("FetchMerkleForLatestEpoch");
  const fetchMerkleForLatestEpoch = await fetchMerkleForLatestEpochFactory.deploy(oracleAddress, jobId);
  console.log("Deploying FetchMerkleForLatestEpoch ...", fetchMerkleForLatestEpoch.address);

  return {'prizeDist':prizeDist.address, 'merkleDist':merkleDist.address, 'fetchMerkle': fetchMerkleForLatestEpoch.address}
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
    await delay(10000);
    // await verify(deployedData.prizeDist, deployedData.merkleDist, deployedData.fetchMerkle);
    await verify(deployedData.merkleDist, STEADY_DAO_TOKEN_ADDRESS);
    await verify(deployedData.fetchMerkle, oracleAddress, jobId);

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
