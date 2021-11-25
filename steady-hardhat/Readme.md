# Basics
Steady DAO is a spliter that splits a token based on the latest chainlink price into 2 tokens, one token will be the same as the original token and will hold all of its properties.

Another is based on the current USD value of that token.

The equation that we use is 
if K denotes the original token amount, 
let X denote the Steady token,
Y the Unsteady token and if the ratio of M:N = 1:2 then
      
 price = max(1, priceFromOracle());
 X = K * .75 * uint(price)
 Y = K * .25


# Deploying 
This alchemist requires the address of the base token and the chainlink oracle for deployment.


# Testing 
```
npx hardhat test
```

## Coverage
To check test coverage -

```
npx hardhat coverage
```
