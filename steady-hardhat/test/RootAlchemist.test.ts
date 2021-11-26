import { Wallet } from 'ethers'
import { Contract } from "@ethersproject/contracts";
import { ethers, waffle, network } from "hardhat";
// import { Signer } from "ethers";
import { expect } from "chai";
import { describe } from "mocha";
import { RootAlchemist, Steady, Unsteady, CacheGold, DummyPriceOracleForTesting } from '../src/types';

let mrAlchemist:RootAlchemist;

const testAddresses = [ '0xb4E459c2d7C9C4A13C4870ED35653d71536F5a4B', '0xE61A17362BEcE0764C641cd449B4c56150c99c80'];
const feeAddress = '0x3E924146306957bD453502e33B9a7B6AbA6e4D3a';
const DAY = 86400;

// Start test block
describe('Check the Alchemy', () => {
  let wallet: Wallet, backedTreasury: Wallet, cgtHolder: Wallet;
  let factory:RootAlchemist;
  let scgt:Steady;
  let unsteady:Unsteady;
  let cgt:CacheGold;
  let dummyPriceOracleForTesting:DummyPriceOracleForTesting;
  let loadFixture: ReturnType<typeof createFixtureLoader>;

  const createFixtureLoader = waffle.createFixtureLoader;
  const advanceTimeAndBlock = async(_days:number) => {
    await network.provider.send("evm_increaseTime", [_days]);
    await network.provider.send("evm_mine");
   }
  const fixture = async () => {
  const priceOracle = "0x34BCe86EEf8516282FEE6B5FD19824163C2B5914";
  const lockedGoldOracle = await ethers.getContractFactory("LockedGoldOracle");
  const _lockedGoldOracle = await lockedGoldOracle.deploy();


  const cacheGold = await ethers.getContractFactory("CacheGold");
  cgt = await cacheGold.deploy( 
    "0xBc92dcCe42e3bE7a636b80a28f19f63FF1a91088",
    backedTreasury.address,
    "0x84ba6405774911D566584c3F348326B43A2f6f7C", 
    "0x55073c1E0e75cFbfb49eb7178113645FBC80D2D1",
     _lockedGoldOracle.address) as CacheGold;

     //set some gold in locked gold oracle
     //mint new tokens into backed treasury
     await _lockedGoldOracle.lockAmount(ethers.utils.parseUnits("1000000000000", 8));
     await cgt.addBackedTokens(ethers.utils.parseUnits("100", 8));
     await cgt.connect(backedTreasury).transfer(cgtHolder.address, ethers.utils.parseUnits("100", 8));

    console.log("Deploying cacheGold...", cgt.address);


    /* Then deploy the wrapped/stable CGT */
    const _wrappedCGT = await ethers.getContractFactory("Steady");
    scgt = await _wrappedCGT.deploy() as Steady;
    console.log("Deploying steady...", scgt.address);

    /* Then deploy the leveraged CGT */
    const _unsteadyCGT = await ethers.getContractFactory("Unsteady");
    unsteady = await _unsteadyCGT.deploy(feeAddress) as Unsteady;
    console.log("Deploying unsteady...", unsteady.address);

    /* For testing we use a dummy price oracle */
    const _dummyPriceOracleForTesting = await ethers.getContractFactory("DummyPriceOracleForTesting");
    dummyPriceOracleForTesting = await _dummyPriceOracleForTesting.deploy() as DummyPriceOracleForTesting;
    console.log("Deploying dummyPriceOracleForTesting...", dummyPriceOracleForTesting.address);
    /* Then deploy the RootAlchemist CGT */
    const _mrAlchemist = await ethers.getContractFactory("RootAlchemist");
    mrAlchemist = await _mrAlchemist.deploy(cgt.address, scgt.address, unsteady.address, dummyPriceOracleForTesting.address) as RootAlchemist;
    console.log("Deploying mrAlchemist...", mrAlchemist.address);

    return mrAlchemist;
  }

  before('create fixture loader', async () => {
    [wallet, backedTreasury, cgtHolder] = await (ethers as any).getSigners()
    console.log("Wallet addresses - ", wallet.address, backedTreasury.address)

    loadFixture = createFixtureLoader([wallet, backedTreasury])
  })

  beforeEach('deploy factory', async () => {
    mrAlchemist = await loadFixture(fixture);
    await scgt.setAlchemist(mrAlchemist.address);
    await unsteady.setAlchemist(mrAlchemist.address);
    await unsteady.setFeeExempt(mrAlchemist.address);
    await dummyPriceOracleForTesting.setLatestPrice(5778003570);
    // await cgt.setFeeExempt(mrAlchemist.address);
    // Assume that the CGT succeeds in feeExempting alchemist
  })

  describe('Ideal alchemy cases for Alchemist', () => {
  
    it('can split CGT belonging to it', async () => {
      let cgtToSplit =  await cgt.connect(cgtHolder).balanceOf(cgtHolder.address);

      await cgt.connect(cgtHolder).approve(mrAlchemist.address, cgtToSplit);
      let alchemist = await scgt.getAlchemist();

      await mrAlchemist.connect(cgtHolder).splitCGT(cgtToSplit);

      expect(await scgt.connect(cgtHolder).balanceOf(cgtHolder.address)).equals(432917350442);
      let balanceOfNoFeesCGTHolder = await unsteady.connect(cgtHolder).balanceOfNoFees(cgtHolder.address);
      let calcBalance = (cgtToSplit.toNumber()  * (1/4))
      .toString().slice(0, -4).padEnd(10, '0');
      expect(balanceOfNoFeesCGTHolder.toNumber().toString()).equals(calcBalance);
    });


    it('can split and merge CGT belonging to it', async () => {

      let cgtAmountToMerge = await cgt.connect(cgtHolder).balanceOf(cgtHolder.address);
      await cgt.connect(cgtHolder).approve(mrAlchemist.address, cgtAmountToMerge);
      let unsteadyTokenBal = await unsteady.connect(cgtHolder).balanceOf(cgtHolder.address);
      let cgtBal = await cgt.connect(cgtHolder).balanceOf(cgtHolder.address);


      let alchemist = await scgt.getAlchemist();
      await mrAlchemist.connect(cgtHolder).splitCGT(cgtAmountToMerge);
      unsteadyTokenBal = await unsteady.connect(cgtHolder).balanceOf(cgtHolder.address);
      cgtBal = await cgt.connect(cgtHolder).balanceOf(cgtHolder.address);

      expect(await scgt.connect(cgtHolder).balanceOf(cgtHolder.address)).equals(432917350442);

      let balanceOfNoFeesCGTHolder = await unsteady.connect(cgtHolder).balanceOfNoFees(cgtHolder.address);
      let calcBalance = (cgtAmountToMerge.toNumber()  * (1/4))
      .toString().slice(0, -4).padEnd(10, '0');//set the last digit to 0
      expect(balanceOfNoFeesCGTHolder.toNumber().toString()).equals(calcBalance);

      await unsteady.connect(cgtHolder).approve(mrAlchemist.address, cgtAmountToMerge);
      let currentPrice = await mrAlchemist.priceFromOracle();
      let scgtAmount =  (cgtAmountToMerge.mul(75).mul(currentPrice)).div(10000000000);
      await scgt.connect(cgtHolder).approve(mrAlchemist.address, scgtAmount);
      
      let balOfLCGTWithFees = await unsteady.connect(cgtHolder).balanceOf(cgtHolder.address);

      let amountToMerge = ethers.BigNumber.from(balOfLCGTWithFees).mul(4);

      await mrAlchemist.connect(cgtHolder).mergeCGT(amountToMerge);
      let alchemistBalNF = await cgt.balanceOfNoFees(mrAlchemist.address);
      let alchemistBal = await cgt.balanceOf(mrAlchemist.address);


      //Later calculate fees here by calling relevant functions and subtract instead of hardcoding
      await cgt.connect(cgtHolder).transferFrom(mrAlchemist.address, cgtHolder.address, amountToMerge);
      unsteadyTokenBal = await unsteady.connect(cgtHolder).balanceOf(cgtHolder.address);
      cgtBal = await cgt.connect(cgtHolder).balanceOf(cgtHolder.address);
      expect(await cgt.connect(cgtHolder).balanceOfNoFees(cgtHolder.address)).equals(amountToMerge);
    });
  });

  describe('Time based alchemy cases for Alchemist with constant price', () => {
  
   it('can split CGT belonging to it that accrues storage fees for a year', async () => {
      let cgtToSplit =  await cgt.connect(cgtHolder).balanceOf(cgtHolder.address);
      
      await cgt.connect(cgtHolder).approve(mrAlchemist.address, cgtToSplit);
      let alchemist = await scgt.getAlchemist();
      await advanceTimeAndBlock(365 * DAY);

      cgtToSplit = await cgt.connect(cgtHolder).balanceOf(cgtHolder.address);
      await mrAlchemist.connect(cgtHolder).splitCGT(cgtToSplit);

      expect(await scgt.connect(cgtHolder).balanceOf(cgtHolder.address)).equals(431835057065);
      expect(await unsteady.connect(cgtHolder).balanceOfNoFees(cgtHolder.address)).equals(
        Math.floor(
          Number((cgtToSplit.toNumber()  * (1/4)).toPrecision(9))));
    });

    it('cannot split CGT belonging to it that accrues too much storage fees for a year', async () => {
      let cgtToSplit =  await cgt.connect(cgtHolder).balanceOf(cgtHolder.address);
      // console.log("Before: ", cgtToSplit.toNumber())
      await cgt.connect(cgtHolder).approve(mrAlchemist.address, cgtToSplit);
      let alchemist = await scgt.getAlchemist();
      await advanceTimeAndBlock(365 * DAY);

      await expect(mrAlchemist.connect(cgtHolder).splitCGT(cgtToSplit)).to.be.revertedWith("You do not have enough CGT");
    });


    it('can split CGT belonging to it that accrues storage fees for ten years', async () => {
      let cgtToSplit =  await cgt.connect(cgtHolder).balanceOf(cgtHolder.address);

      await cgt.connect(cgtHolder).approve(mrAlchemist.address, cgtToSplit);
      let alchemist = await scgt.getAlchemist();

      await advanceTimeAndBlock(3650 * DAY);

      cgtToSplit = await cgt.connect(cgtHolder).balanceOf(cgtHolder.address);
      await mrAlchemist.connect(cgtHolder).splitCGT(cgtToSplit);

      expect(await scgt.connect(cgtHolder).balanceOf(cgtHolder.address)).equals(399366255752);
      expect(await unsteady.connect(cgtHolder).balanceOfNoFees(cgtHolder.address)).equals(
        Math.floor(
          Number((cgtToSplit.toNumber()  * (1/4)).toPrecision(9))));
    });

    it('cannot split CGT belonging to it that accrues too much storage fees for ten years', async () => {
      let cgtToSplit =  await cgt.connect(cgtHolder).balanceOf(cgtHolder.address);

      await cgt.connect(cgtHolder).approve(mrAlchemist.address, cgtToSplit);
      let alchemist = await scgt.getAlchemist();

      await advanceTimeAndBlock(3650 * DAY);

      cgtToSplit = await cgt.connect(cgtHolder).balanceOf(cgtHolder.address);
      expect (mrAlchemist.connect(cgtHolder).splitCGT(cgtToSplit)).to.be.reverted;
    });


    it('can split and merge CGT belonging to it that accrues storage fees for a year', async () => {

      let cgtAmountToMerge = await cgt.connect(cgtHolder).balanceOf(cgtHolder.address);
      await cgt.connect(cgtHolder).approve(mrAlchemist.address, cgtAmountToMerge);
      let unsteadyTokenBal = await unsteady.connect(cgtHolder).balanceOf(cgtHolder.address);
      let cgtBal = await cgt.connect(cgtHolder).balanceOf(cgtHolder.address);

      await advanceTimeAndBlock(365 * DAY);
      cgtAmountToMerge = await cgt.connect(cgtHolder).balanceOf(cgtHolder.address);

      await mrAlchemist.connect(cgtHolder).splitCGT(cgtAmountToMerge);
      unsteadyTokenBal = await unsteady.connect(cgtHolder).balanceOf(cgtHolder.address);
      cgtBal = await cgt.connect(cgtHolder).balanceOf(cgtHolder.address);

      let alchBal = await cgt.balanceOf(mrAlchemist.address);
      console.log("Alchemist Bal Aft Split: %s || cgtAmt: %s", alchBal, cgtAmountToMerge);

      expect(await scgt.connect(cgtHolder).balanceOf(cgtHolder.address)).equals(431835057065);
      expect(await unsteady.connect(cgtHolder).balanceOfNoFees(cgtHolder.address)).equals(
        Math.floor(
        Number(
          (cgtAmountToMerge.toNumber()  * (1/4)).toPrecision(9))));

      await unsteady.connect(cgtHolder).approve(mrAlchemist.address, cgtAmountToMerge);
      let currentPrice = await mrAlchemist.priceFromOracle();
      let scgtAmount =  (cgtAmountToMerge.mul(75).mul(currentPrice)).div(10000000000);
      await scgt.connect(cgtHolder).approve(mrAlchemist.address, scgtAmount);
      
      let balOfLCGTWithFees = await unsteady.connect(cgtHolder).balanceOf(cgtHolder.address);

      let amountToMerge = ethers.BigNumber.from(balOfLCGTWithFees).mul(4);

      await mrAlchemist.connect(cgtHolder).mergeCGT(amountToMerge);
      let alchemistBalNF = await cgt.balanceOfNoFees(mrAlchemist.address);
      let alchemistBal = await cgt.balanceOf(mrAlchemist.address);


      //Later calculate fees here by calling relevant functions and subtract instead of hardcoding
      console.log("amountToMerge: %s, mrAlch Bal: %s, balLCGTFees: %s", amountToMerge, alchemistBal, balOfLCGTWithFees);
      await cgt.connect(cgtHolder).transferFrom(mrAlchemist.address, cgtHolder.address, amountToMerge);
      unsteadyTokenBal = await unsteady.connect(cgtHolder).balanceOf(cgtHolder.address);
      cgtBal = await cgt.connect(cgtHolder).balanceOf(cgtHolder.address);
      expect(await cgt.connect(cgtHolder).balanceOfNoFees(cgtHolder.address)).equals(amountToMerge);
    });

    xit('can split and merge CGT belonging to it that accrues storage fees for a year and then kept in unsteady for a year', async () => {
      let cgtAmountToMerge = await cgt.connect(cgtHolder).balanceOf(cgtHolder.address);
      await cgt.connect(cgtHolder).approve(mrAlchemist.address, cgtAmountToMerge);
      let unsteadyTokenBal = await unsteady.connect(cgtHolder).balanceOf(cgtHolder.address);
      let cgtBal = await cgt.connect(cgtHolder).balanceOf(cgtHolder.address);

      await advanceTimeAndBlock(365);

      let alchemist = await scgt.getAlchemist();
      await mrAlchemist.connect(cgtHolder).splitCGT(cgtAmountToMerge);
      unsteadyTokenBal = await unsteady.connect(cgtHolder).balanceOf(cgtHolder.address);
      cgtBal = await cgt.connect(cgtHolder).balanceOf(cgtHolder.address);

      expect(await scgt.connect(cgtHolder).balanceOf(cgtHolder.address)).equals(432917350442);
      expect(await unsteady.connect(cgtHolder).balanceOfNoFees(cgtHolder.address)).equals(Math.floor(cgtAmountToMerge.toNumber()  * (1/4)));

      await unsteady.connect(cgtHolder).approve(mrAlchemist.address, cgtAmountToMerge);
      await scgt.connect(cgtHolder).approve(mrAlchemist.address, cgtAmountToMerge);
      await advanceTimeAndBlock(365);
      
      let balOfLCGTWithFees = await unsteady.connect(cgtHolder).balanceOf(cgtHolder.address);

      let amountToMerge = ethers.BigNumber.from(balOfLCGTWithFees).mul(4);
      
      await mrAlchemist.connect(cgtHolder).mergeCGT(amountToMerge);
      //Later calculate fees here by calling relevant functions and subtract instead of hardcoding
      await cgt.connect(cgtHolder).transferFrom(mrAlchemist.address, cgtHolder.address, 9990009888);
      unsteadyTokenBal = await unsteady.connect(cgtHolder).balanceOf(cgtHolder.address);
      cgtBal = await cgt.connect(cgtHolder).balanceOf(cgtHolder.address);

      expect(await cgt.connect(cgtHolder).balanceOf(cgtHolder.address)).equals(9990009888);
    });
  });

  describe.skip('Alchemy cases for Alchemist with fluctuating price', () => {
  
    it('should not be able to split at a lower price and merge CGT belonging to it at a higher price', async () => {
      //split at $50
      await dummyPriceOracleForTesting.setLatestPrice(5778003570);
      
      
      let cgtAmountToMerge = await cgt.connect(cgtHolder).balanceOf(cgtHolder.address);
      await cgt.connect(cgtHolder).approve(mrAlchemist.address, cgtAmountToMerge);
      let unsteadyTokenBal = await unsteady.connect(cgtHolder).balanceOf(cgtHolder.address);
      let cgtBal = await cgt.connect(cgtHolder).balanceOf(cgtHolder.address);


      let alchemist = await scgt.getAlchemist();
      await mrAlchemist.connect(cgtHolder).splitCGT(cgtAmountToMerge);
      unsteadyTokenBal = await unsteady.connect(cgtHolder).balanceOf(cgtHolder.address);
      cgtBal = await cgt.connect(cgtHolder).balanceOf(cgtHolder.address);

      expect(await scgt.connect(cgtHolder).balanceOf(cgtHolder.address)).equals(432917350442);
      expect(await unsteady.connect(cgtHolder).balanceOfNoFees(cgtHolder.address)).equals(Math.floor(cgtAmountToMerge.toNumber()  * (1/4)));

      await unsteady.connect(cgtHolder).approve(mrAlchemist.address, cgtAmountToMerge);
      let currentPrice = await mrAlchemist.priceFromOracle();
      let scgtAmount =  (cgtAmountToMerge.mul(75).mul(currentPrice)).div(10000000000);
      await scgt.connect(cgtHolder).approve(mrAlchemist.address, scgtAmount);
      
      let balOfLCGTWithFees = await unsteady.connect(cgtHolder).balanceOf(cgtHolder.address);
      let amountToMerge = ethers.BigNumber.from(balOfLCGTWithFees).mul(4);

      //Merge at $60
      await dummyPriceOracleForTesting.setLatestPrice(6778003570);
      
      await expect(mrAlchemist.connect(cgtHolder).mergeCGT(amountToMerge)).to.be.revertedWith("Need more Steady");
    });

    it('can split at a higher price and merge CGT belonging to it at a lower price', async () => {
      
      let cgtAmountToMerge = await cgt.connect(cgtHolder).balanceOf(cgtHolder.address);
      await cgt.connect(cgtHolder).approve(mrAlchemist.address, cgtAmountToMerge);
      let unsteadyTokenBal = await unsteady.connect(cgtHolder).balanceOf(cgtHolder.address);
      let cgtBal = await cgt.connect(cgtHolder).balanceOf(cgtHolder.address);


      let alchemist = await scgt.getAlchemist();
      await mrAlchemist.connect(cgtHolder).splitCGT(cgtAmountToMerge);
      unsteadyTokenBal = await unsteady.connect(cgtHolder).balanceOf(cgtHolder.address);
      cgtBal = await cgt.connect(cgtHolder).balanceOf(cgtHolder.address);

      expect(await scgt.connect(cgtHolder).balanceOf(cgtHolder.address)).equals(432917350442);
      expect(await unsteady.connect(cgtHolder).balanceOfNoFees(cgtHolder.address)).equals(Math.floor(cgtAmountToMerge.toNumber()  * (1/4)));

      await unsteady.connect(cgtHolder).approve(mrAlchemist.address, cgtAmountToMerge);
      let currentPrice = await mrAlchemist.priceFromOracle();
      let scgtAmount =  (cgtAmountToMerge.mul(75).mul(currentPrice)).div(10000000000);
      await scgt.connect(cgtHolder).approve(mrAlchemist.address, scgtAmount);
      
      let balOfLCGTWithFees = await unsteady.connect(cgtHolder).balanceOf(cgtHolder.address);

      let amountToMerge = ethers.BigNumber.from(balOfLCGTWithFees).mul(4);
      //Merge at $40
      await dummyPriceOracleForTesting.setLatestPrice(4778003570);

      await mrAlchemist.connect(cgtHolder).mergeCGT(amountToMerge);
      let alchemistBalNF = await cgt.balanceOfNoFees(mrAlchemist.address);
      let alchemistBal = await cgt.balanceOf(mrAlchemist.address);


      //Later calculate fees here by calling relevant functions and subtract instead of hardcoding
      await cgt.connect(cgtHolder).transferFrom(mrAlchemist.address, cgtHolder.address, amountToMerge);
      unsteadyTokenBal = await unsteady.connect(cgtHolder).balanceOf(cgtHolder.address);
      cgtBal = await cgt.connect(cgtHolder).balanceOf(cgtHolder.address);
      expect(await cgt.connect(cgtHolder).balanceOfNoFees(cgtHolder.address)).equals(amountToMerge);
    });
  });

})