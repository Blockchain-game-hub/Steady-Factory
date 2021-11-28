import { ethers } from "ethers";

let provider = ethers.getDefaultProvider("mumbai");
let privateKey = "5eeb541643d1a8b040b8934ddd2482815bee040a710b4ddc4bc3738447fafff4";
let wallet = new ethers.Wallet(privateKey, provider);
const tokenAddr = "0x0936597380adb89dE3a9cA8aF322e042cbd1193B";
const chymeAddress = '0x3845badAde8e6dFF049820680d1F14bD3903a5d0';
const oracleAddress = '0xCF4Be57aA078Dc7568C631BE7A73adc1cdA992F8';
const chymeSymbol = "SAND";

// The ERC-20 Contract ABI, which is a common contract interface
// for tokens (this is the Human-Readable ABI format)
const daiAbi = [
  // Some details about the token
  "function alchemist(address _Chyme, address _priceOracle, string memory _symbol) external returns (address)"
];

// The Contract object
let tokenContract = new ethers.Contract(tokenAddr, daiAbi, wallet).connect(wallet);

async function main() {
  let overrides = {
    value: ethers.utils.parseEther("0.1")
  };
  // let uri = await tokenContract.setStorageFeePaidPeriod(1651911566, 8);
  // let uri = await tokenContract.forceTransferToCache(8, {gasLimit:550000});
  let uri = await tokenContract.alchemist(chymeAddress, oracleAddress, chymeSymbol, {gasLimit: 11250000});
  console.log(uri);
}

main()
  .catch((err) => {
    console.error(err);
  });