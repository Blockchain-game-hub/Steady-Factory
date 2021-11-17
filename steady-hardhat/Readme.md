#Basics

This smart contract is a pure splitter, we basically pass in an asset backed token contract such as CGT and in return what it does is split it into M/N parts. One
part will still have all the effects of the parent token and is called the Unsteady token and the other which is the equivalent ration represented by dollars is a Steady token. 

So here in the Cache contract for eg. The Unsteady Token is very similar to the existing Cache Gold token in that it has to pay transfer and storage fees etc. 
But is more lightweight with some of the extra functionalities removed, the reasoning is that we can mint

Differences in Unsteady.sol vs Cache Token
1. Removed functions related to the life cycle of token, but kept everything related to fees
1. Compiler version changed to 0.8.0
1. Added SPDX licenses
1. Inheriting directly as an ERC20 Token
1. Not using safemath because compiler > 0.8.0
1. Removed all functionalities w.r.t CACHE token minting etc and only have feeAddress
1. Add setters and getters for router
1. Removed AddBackedGold and added mint function that works similar to AddBackedGold but without the oracle check etc
1. Modified math operations to use symbols rather than safemath

The Steady token is a pure erc20 token and does not have to pay any fees. 
The smart contract ensures that if you add the two back together again you get back the original asset backed token.

There is no other added functionalities.

The equation that we use is 
if K denotes the original token amount, 
let X denote the Steady token,
Y the Unsteady token and if the ratio of M:N = 1:2 then
      
 price = max(1, priceFromOracle());
 X = K * .75 * uint(price)
 Y = K * .25


# Deploying 
This automated minter requires the address of the base token for deployment.


# Testing 
```
npx hardhat test
```

## Coverage
To check test coverage -

```
npx hardhat coverage
```

Note that the Root Alchemist tests are still in progress


## Deployed on
### Rinkeby

 cgt = '0x59e5a2387543e92161442D8432FEb5614922f451'
 Steady = '0x0bb8b43DfD1470f0fcF05cc71cF590eEDB8DC379'
 Unsteady = '0xC3887dc952671f3845905d69b36661DaD22926dA'
 RootAlchemist = '0x58872E71218B7e4DDd88dF2f2Eb3E6e9d860dD2E'
