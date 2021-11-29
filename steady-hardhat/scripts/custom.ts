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

async function main() {

  // const accounts = await ethers.getSigners()
  // let tokenContract = new ethers.Contract(tokenAddr, daiAbi, accounts[0]).connect(accounts[0]);
  // let overrides = {
  //   value: ethers.utils.parseEther("0.1")
  // };

  // // let uri = await tokenContract.alchemist(chymeAddress, oracleAddress, chymeSymbol, { gasLimit: 11250000 });
  // let uri = await tokenContract.getLatestAlchemist();
  // console.log(uri);
  // // return tokenContract.address;
  return "0x5EB1303916F2a56455f563B5a5b3Fa33b3Ed498E";
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
    // await delay(50000);
    await verify(deployedData);

    process.exit(0)
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });