import { ethers } from "hardhat";
import * as hre from "hardhat";

const tokenAddr = "0x4bae94FC93deE9712d94451FC434421F883a3300";
const chymeAddress = '0x326c977e6efc84e512bb9c30f76e30c160ed06fb';
const oracleAddress = '0x12162c3E810393dEC01362aBf156D7ecf6159528';
const chymeSymbol = "LINK";

// The ERC-20 Contract ABI, which is a common contract interface
// for tokens (this is the Human-Readable ABI format)
const daiAbi = [
  // Some details about the token
  "function alchemist(address _Chyme, address _priceOracle, string memory _symbol) external returns (address)",
  "function getLatestAlchemist() external view returns (address)"
];

// The Contract object

const ufoTokenAddr = "0x249e38ea4102d0cf8264d3701f1a0e39c4f2dc3b";


async function main() {
  const SteadyDaoToken = await ethers.getContractFactory("SteadyDaoToken");
  const sdt = await SteadyDaoToken.deploy(ufoTokenAddr,
    { gasLimit: 11250000 }
  );
  await sdt.deployed();
  console.log("SteadyDaoToken deployed to:", sdt.address);
  console.log("Now verifying...");
//   await verify(sdt.address);
  console.log(sdt);
  return sdt.address;
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
    const accounts = await ethers.getSigners()
    await delay(50000);
    await verify(deployedData, ufoTokenAddr);

    process.exit(0)
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });