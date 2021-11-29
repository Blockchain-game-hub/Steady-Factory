import { Wallet } from 'ethers'
import { Contract } from "@ethersproject/contracts";
import { ethers, waffle, network } from "hardhat";
// import { Signer } from "ethers";
import { BigNumber } from '@ethersproject/bignumber';
import { expect } from "chai";
import { describe } from "mocha";
import { Alchemist, AlchemistAcademy, DummyPriceOracleForTesting, ICHYME, ERC20PresetMinterPauserUpgradeable, SteadyDaoToken } from '../src/types/index';
import * as hre from "hardhat";
// let mrAlchemist:Alchemist;
let factory: AlchemistAcademy;
let sdt: SteadyDaoToken;
let chymeI: Contract;
let alch: Contract;
let alchI: Contract;

const testAddresses = ['0xb4E459c2d7C9C4A13C4870ED35653d71536F5a4B', '0xE61A17362BEcE0764C641cd449B4c56150c99c80'];
const feeAddress = '0x3E924146306957bD453502e33B9a7B6AbA6e4D3a';

// SAND token and Oracle
// Tests are based on Block: 13670552
const chymeAddress = '0x3845badAde8e6dFF049820680d1F14bD3903a5d0';
const oracleAddress = '0xCF4Be57aA078Dc7568C631BE7A73adc1cdA992F8';
const chymeSymbol = "SAND";
const chymeImpersonate = "0x59cE29e760F79cd83395fB3d017190Bd727542f7";
const ufoTokenAddr = "0x249e38ea4102d0cf8264d3701f1a0e39c4f2dc3b";
const DAY = 86400;

const factoryAbi = [
    "function alchemist(address _Chyme, address _priceOracle, string memory _symbol) external view returns (address)"
]

const chymeAbi = [
    "function balanceOf(address owner) public view returns (uint256)",
    "function getSteady() public view returns (address)",
    "function approve(address spender,uint256 addedValue) returns (bool)",
    "function transferFrom(address from,address to,uint256 value) external returns (bool)"
]

const alchAbi = [
    "function getSteady() public view returns (address)",
    "function getSdtAddr() public view returns(address)",
    "function split(uint256 amount) external returns (bool)"
]

// Start test block
describe('Check the Alchemy', async () => {
    let wallet: Wallet, Wallet2: Wallet, Wallet3: Wallet, chymeHolder: Wallet;
    // let scgt:Steady;
    // let unsteady:Unsteady;
    let dummyPriceOracleForTesting: DummyPriceOracleForTesting;
    let loadFixture: ReturnType<typeof createFixtureLoader>;

    const createFixtureLoader = waffle.createFixtureLoader;

    before('create fixture loader', async () => {
        await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [chymeImpersonate],
        });
        await network.provider.send("hardhat_setBalance", [
            chymeImpersonate,
            "0xA688906BD8B00000",
        ]);
        [wallet, Wallet2, Wallet3] = await (ethers as any).getSigners()
        chymeHolder = await (ethers as any).getSigner(chymeImpersonate);
        console.log("Wallet addresses - %s, %s, \n Chyme Address: %s", wallet.address, Wallet2.address, chymeHolder.address);

        loadFixture = createFixtureLoader([wallet, Wallet2])
    })

    beforeEach('deploy factory and SteadyDaoToken', async () => {
        const SteadyDaoToken = await ethers.getContractFactory("SteadyDaoToken");
        sdt = await SteadyDaoToken.deploy(ufoTokenAddr) as SteadyDaoToken;

        const factoryProxy = await ethers.getContractFactory("AlchemistAcademy");
        factory = await factoryProxy.deploy(sdt.address) as AlchemistAcademy;

        // const chymeFactory = await ethers.getContractFactory("ICHYME");

        // factoryI = new ethers.Contract(factory.address, factoryAbi, wallet).connect(wallet);

        // chymeI = new ethers.Contract(chymeAddress, chymeAbi, chymeHolder).connect(chymeHolder);
        chymeI = await ethers.getContractAt(chymeAbi, chymeAddress) as ICHYME;
        const _dummyPriceOracleForTesting = await ethers.getContractFactory("DummyPriceOracleForTesting");
        dummyPriceOracleForTesting = await _dummyPriceOracleForTesting.deploy() as DummyPriceOracleForTesting;

        await dummyPriceOracleForTesting.setLatestAnswer(5778003570);
    })


    describe('Setting up Alchemist Factory', async () => {
        it('setup factory', async () => {
            let alchemistAddr = await factory.connect(chymeHolder).alchemist(chymeAddress, dummyPriceOracleForTesting.address, chymeSymbol);
            // console.log(Number(await chymeI.balanceOf(chymeHolder.address)));
            // console.log('Alchemist address: ', alchemistAddr);
        });
    });

    describe('Ideal alchemy cases for Alchemist', () => {
        it('can split TokenX belonging to it', async () => {
            let alchemistGetContract = await ethers.getContractFactory("Alchemist");

            await factory.connect(chymeHolder).alchemist(chymeAddress, dummyPriceOracleForTesting.address, chymeSymbol);
            let alchemistAddr = await factory.getLatestAlchemist();

            let alchI = await alchemistGetContract.attach(alchemistAddr) as Alchemist;
            console.log("The alchemist address from the test is  - ", alchemistAddr);

            // Mint SDT
            await sdt.mint(alchI.address, 10000);

            let chymeHolderBal = await chymeI.balanceOf(chymeHolder.address);
            let splitAmt = 1e18;

            console.log("chymeI balanceOf chymeHolder: ", chymeHolderBal.toString());
            await chymeI.connect(chymeHolder).approve(alchI.address, BigNumber.from(splitAmt.toString()));
            await alchI.connect(chymeHolder).split(BigNumber.from(splitAmt.toString()));

            let tokenToSplitAfter = await chymeI.balanceOf(chymeHolder.address);
            console.log("chymeI balanceOf tokenToSplitAfter: ", tokenToSplitAfter.toString());

            expect(tokenToSplitAfter.toString()).to.be.equal(
                (BigNumber.from(chymeHolderBal.toString()).sub(
                    BigNumber.from(splitAmt.toString()))).toString()
            );

            let ERCFactory = await ethers.getContractFactory("ERC20PresetMinterPauserUpgradeable");
            let stdAddr = await alchI.getSteadyAddr();
            let elxAddr = await alchI.getElixirAddr();
            let Steady = await ERCFactory.attach(stdAddr) as ERC20PresetMinterPauserUpgradeable;
            let Elixir = await ERCFactory.attach(elxAddr) as ERC20PresetMinterPauserUpgradeable;

            // console.log("LATEST UPDATE:::::::: %s", await Steady.balanceOf(chymeHolder.address));
            expect(await Steady.balanceOf(chymeHolder.address)).equals(BigNumber.from("43335026775000000000"));
            expect(await Elixir.balanceOf(chymeHolder.address)).equals(BigNumber.from("250000000000000000"));


            // Transfer SDT to splitter
            console.log("Transfering 10 SDT from AlchI to ChymeHolder splitter");
            await sdt.connect(chymeHolder).transferFrom(alchI.address, chymeHolder.address, 10);
            expect(await sdt.balanceOf(chymeHolder.address)).to.be.equal(10);
        });

        it('can merge TokenX belonging to it', async () => {
            await factory.connect(chymeHolder).alchemist(chymeAddress, dummyPriceOracleForTesting.address, chymeSymbol);

            let alchemistGetContract = await ethers.getContractFactory("Alchemist");
            let alchemistAddr = await factory.getLatestAlchemist();
            let alchI = await alchemistGetContract.attach(alchemistAddr) as Alchemist;

            let chymeHolderBal = await chymeI.balanceOf(chymeHolder.address);
            let splitAmt = 1e18;

            await chymeI.connect(chymeHolder).approve(alchI.address, BigNumber.from(splitAmt.toString()));
            await alchI.connect(chymeHolder).split(BigNumber.from(splitAmt.toString()));

            let ERCFactory = await ethers.getContractFactory("ERC20PresetMinterPauserUpgradeable");
            let stdAddr = await alchI.getSteadyAddr();
            let elxAddr = await alchI.getElixirAddr();
            let Steady = await ERCFactory.attach(stdAddr) as ERC20PresetMinterPauserUpgradeable;
            let Elixir = await ERCFactory.attach(elxAddr) as ERC20PresetMinterPauserUpgradeable;

            // ------ Try to merge back the splitAmt ------
            // approves the merge amt

            let steadyAmt = "43335026775000000000".toString();
            let elixirAmt = "250000000000000000".toString();

            await Steady.connect(chymeHolder).approve(alchI.address, BigNumber.from(steadyAmt));
            await Elixir.connect(chymeHolder).approve(alchI.address, BigNumber.from(elixirAmt));
            console.log("Steady alchI(%s) Allowance: %s", alchI.address, await Steady.allowance(chymeHolder.address, alchI.address));
            console.log("Elixir alchI(%s) Allowance: %s", alchI.address, await Elixir.allowance(chymeHolder.address, alchI.address));
            await alchI.connect(chymeHolder).merge(BigNumber.from(splitAmt.toString()));
            await chymeI.connect(chymeHolder).transferFrom(alchI.address, chymeI.address, BigNumber.from(splitAmt.toString()));
        });
    });
});