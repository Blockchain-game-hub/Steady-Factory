import { Wallet } from 'ethers'
import { Contract } from "@ethersproject/contracts";
import { ethers, waffle, network } from "hardhat";
// import { Signer } from "ethers";
import { expect } from "chai";
import { describe } from "mocha";
import { Alchemist, FactoryProxy, DummyPriceOracleForTesting } from '../src/types/index';

// let mrAlchemist:Alchemist;
let factory: FactoryProxy;
let factoryI: Contract;
let chymeI: Contract;
let alch: Contract;
let alchI: Contract;

const testAddresses = ['0xb4E459c2d7C9C4A13C4870ED35653d71536F5a4B', '0xE61A17362BEcE0764C641cd449B4c56150c99c80'];
const feeAddress = '0x3E924146306957bD453502e33B9a7B6AbA6e4D3a';

// SAND token and Oracle
const chymeAddress = '0x3845badAde8e6dFF049820680d1F14bD3903a5d0';
const oracleAddress = '0xCF4Be57aA078Dc7568C631BE7A73adc1cdA992F8';
const chymeSymbol = "SAND";
const chymeImpersonate = "0x59cE29e760F79cd83395fB3d017190Bd727542f7";
const DAY = 86400;

const factoryAbi = [
    "function alchemist(address _Chyme, address _priceOracle, string memory _symbol) external view returns (address)"
]

const chymeAbi = [
    "function balanceOf(address owner) public view returns (uint256)",
    "function getSteady() public view returns (address)"
]

const alchAbi = [
    "function getSteady() public view returns (address)",
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
        [wallet, Wallet2, Wallet3] = await (ethers as any).getSigners()
        chymeHolder = await (ethers as any).getSigner(chymeImpersonate);
        console.log("Wallet addresses - %s, %s, \n Chyme Address: %s", wallet.address, Wallet2.address, chymeHolder.address);

        loadFixture = createFixtureLoader([wallet, Wallet2])
    })

    beforeEach('deploy factory', async () => {
        // factory = await loadFixture(fixture);
        const factoryProxy = await ethers.getContractFactory("FactoryProxy");
        factory = await factoryProxy.deploy() as FactoryProxy;
        factoryI = new ethers.Contract(factory.address, factoryAbi, wallet).connect(wallet);

        chymeI = new ethers.Contract(chymeAddress, chymeAbi, chymeHolder).connect(chymeHolder);

        const _dummyPriceOracleForTesting = await ethers.getContractFactory("DummyPriceOracleForTesting");
        dummyPriceOracleForTesting = await _dummyPriceOracleForTesting.deploy() as DummyPriceOracleForTesting;

        await dummyPriceOracleForTesting.setLatestPrice(5778003570);
    })


    describe('Setting up Alchemist Factory', async () => {
        it('setup factory', async () => {
            let alchemistAddr = await factoryI.connect(chymeHolder).alchemist(chymeAddress, oracleAddress, chymeSymbol);
            // console.log(Number(await chymeI.balanceOf(chymeHolder.address)));
            console.log('Alchemist address: ', alchemistAddr);
        });
    });

    describe('Ideal alchemy cases for Alchemist', () => {
        it('can split TokenX belonging to it', async () => {
            let alchemistGetContract = await ethers.getContractFactory("Alchemist");
            
            let alchemistAddr = await factoryI.connect(chymeHolder).alchemist(chymeAddress, oracleAddress, chymeSymbol);

            let alchI = await alchemistGetContract.attach(alchemistAddr) as Alchemist;

            // alchI = new ethers.Contract(alchemistAddr, alchAbi, chymeHolder).connect(chymeHolder);
            
            let tokenToSplit = await chymeI.balanceOf(wallet.address);

            console.log("chymeI balanceOf walletAddress: ", Number(tokenToSplit));

            

            console.log(await alchI.connect(chymeHolder).split(1000));

            // expect(await scgt.connect(Wallet3).balanceOf(Wallet3.address)).equals(432917350442);
            // let balanceOfNoFeesWallet3 = await unsteady.connect(Wallet3).balanceOfNoFees(Wallet3.address);
            // let calcBalance = (tokenToSplit.toNumber()  * (1/4))
            // .toString().slice(0, -4).padEnd(10, '0');
            // expect(balanceOfNoFeesWallet3.toNumber().toString()).equals(calcBalance);
        });
    });
});