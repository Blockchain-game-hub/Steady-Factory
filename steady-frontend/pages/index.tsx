import { Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon, Box, Button, Divider, Heading, Input, SimpleGrid, Stat,
  StatHelpText,
  Stack, Text } from '@chakra-ui/react'
import { useEthers, useContractFunction, useTokenBalance } from '@usedapp/core'
import { Contract } from '@ethersproject/contracts'
import { ethers } from 'ethers'
import React, { useReducer, useEffect } from 'react'
import { 
  RootAlchemist as LOCAL_CONTRACT_ADDRESS, 
  Unsteady as LEVERAGED_CONTRACT_ADDRESS,
  Steady as STEADY_CONTRACT_ADDRESS,
  cgt as CACHE_CONTRACT_ADDRESS } from '../artifacts/contracts/contractAddress'
import RootAlchemist from '../artifacts/contracts/RootAlchemist.sol/RootAlchemist.json'
import Unsteady from '../artifacts/contracts/Unsteady.sol/Unsteady.json'
import Steady from '../artifacts/contracts/Steady.sol/Steady.json'
import CacheGold from '../artifacts/contracts/CacheGold.sol/CacheGold.json'
import Layout from '../components/layout/Layout'
import { 
  RootAlchemist as RootAlchemistType,
  Unsteady as UnsteadyType,
  Steady as SteadyType,
  CacheGold as CacheGoldType
 } from '../types'
import { formatUnits, parseUnits } from 'ethers/lib/utils'


/**
 * Prop Types
 */
type StateType = {
  cgtBalance: string
  balance: string
  leveragedBalance: string
  inputValue: string
  isSplitApproveLoading: boolean
  isSplitLoading: boolean
  isMergeApproveLoading: boolean
  isMergeLoading: boolean
  price: string
}

type ActionType =
  | {
      type: 'SET_BALANCES'
      cgtBalance: StateType['cgtBalance']
      balance: StateType['balance']
      leveragedBalance: StateType['leveragedBalance']
    }
  | {
      type: 'SET_INPUT_VALUE'
      inputValue: StateType['inputValue']
    }
  | {
      type: 'SET_SPLIT_APPROVE_LOADING'
      isSplitApproveLoading: StateType['isSplitApproveLoading']
    }
  | {
    type: 'SET_SPLIT_LOADING'
    isSplitLoading: StateType['isSplitLoading']
  }
  | {
    type: 'SET_MERGE_APPROVE_LOADING'
    isMergeApproveLoading: StateType['isMergeApproveLoading']
  }
  | {
    type: 'SET_MERGE_LOADING'
    isMergeLoading: StateType['isMergeLoading']
  }
  | {
    type: 'SET_ORACLE'
    price: StateType['price']
  }
/**
 * Component
 */
const initialState: StateType = {
  cgtBalance: '0',
  balance: '0',
  leveragedBalance: '0',
  inputValue: '0',
  isSplitApproveLoading: false,
  isSplitLoading: false,
  isMergeApproveLoading: false,
  isMergeLoading: false,
  price: '0'
}

function reducer(state: StateType, action: ActionType): StateType {
  switch (action.type) {
    // Track the balance from the blockchain
    case 'SET_BALANCES':
      return {
        ...state,
        cgtBalance: action.cgtBalance,
        balance: action.balance,
        leveragedBalance: action.leveragedBalance,
      }
    case 'SET_INPUT_VALUE':
      return {
        ...state,
        inputValue: action.inputValue,
      }
    case 'SET_SPLIT_APPROVE_LOADING':
      return {
        ...state,
        isSplitApproveLoading: action.isSplitApproveLoading,
      }
    case 'SET_SPLIT_LOADING':
      return {
        ...state,
        isSplitLoading: action.isSplitLoading,
      }
      case 'SET_MERGE_APPROVE_LOADING':
    return {
      ...state,
      isMergeApproveLoading: action.isMergeApproveLoading,
    }
    case 'SET_MERGE_LOADING':
      return {
        ...state,
        isMergeLoading: action.isMergeLoading,
      }
    case 'SET_ORACLE':
      return {
        ...state,
        price: action.price,
      }
    default:
      throw new Error()
  }
}

// function useTokenAllowance(
//   amount: string | Falsy,
//   price: string | Falsy,
//   spenderAddress: string | Falsy
// ) {
//   const [calledFlag, setCalledFlag] = useState(null);
//   const steadyAmount = ((parseInt(amount) * 75 * parseInt(price) * 10000000000) / 10000000000);
//           // eslint-disable-next-line no-console
//           console.log('Triggered: ', calledFlag)
//   const approveAlchemistForMergeLCGT: ContractCall = {
//     abi:new ethers.utils.Interface( Unsteady.abi),
//     address: LEVERAGED_CONTRACT_ADDRESS,
//     method: 'increaseAllowance',
//     args: [spenderAddress, parseUnits(amount, 8)]
//   }

//   const approveAlchemistForMergeSCGT: ContractCall = {
//     abi:new ethers.utils.Interface( Steady.abi),
//     address: STEADY_CONTRACT_ADDRESS,
//     method: 'increaseAllowance',
//     args: [spenderAddress, parseUnits(steadyAmount.toString(),8)]
//   }

//   const [allowance] = useContractCalls([calledFlag && amount && approveAlchemistForMergeLCGT, calledFlag && amount && approveAlchemistForMergeSCGT]) ?? []

//   return allowance
// }


function HomeIndex(): JSX.Element {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { account, library } = useEthers()
  

  // const isLocalChain =
  //   chainId === ChainId.Localhost || chainId === ChainId.Hardhat

  let signer;
  
  if(library){
    signer = library.getSigner()
  }
  const rootCGTConvertorContract = new Contract(
    LOCAL_CONTRACT_ADDRESS,
    RootAlchemist.abi,
  ) as RootAlchemistType

  const cacheTestTokenContract = new Contract(
    CACHE_CONTRACT_ADDRESS,
    CacheGold.abi,
  ) as CacheGoldType 

  const leveragedCGTContract = new Contract(
    LEVERAGED_CONTRACT_ADDRESS,
    Unsteady.abi
  ) as UnsteadyType

  const steadyContract = new Contract(
    STEADY_CONTRACT_ADDRESS,
    Steady.abi
  ) as SteadyType 


  const approve = useContractFunction(cacheTestTokenContract, 'increaseAllowance', { transactionName: 'Approve', signer: signer })
  const approveAlchemistForMergeLCGT = useContractFunction(leveragedCGTContract, 'increaseAllowance', { transactionName: 'Approve', signer: signer })

  // const approveAlchemistForMergeLCGT = useContractCall(leveragedCGTContract, 'increaseAllowance', { transactionName: 'Approve', signer: signer })
  const approveAlchemistForMergeSCGT = useContractFunction(steadyContract, 'increaseAllowance', { transactionName: 'Approve', signer: signer })
  const split = useContractFunction(rootCGTConvertorContract, 'splitCGT', { transactionName: 'Split', signer: signer })
  const merge = useContractFunction(rootCGTConvertorContract, 'mergeCGT', { transactionName: 'Merge', signer: signer })
  const mergeAndTransfer = useContractFunction(cacheTestTokenContract, 'transferFrom', { transactionName: 'TransferFrom', signer: signer })
  const tokenBalance  = useTokenBalance(CACHE_CONTRACT_ADDRESS, account)
  // const allowance = useTokenAllowance(state.inputValue, state.price, LOCAL_CONTRACT_ADDRESS);
        // eslint-disable-next-line no-console
        // console.log('allowance: ', allowance)



  useEffect(() => {
    // Update the document title using the browser API
     fetchContractBalances();
     fetchOraclePrice();
    //  steadyAmount  = ((parseInt(state.inputValue) * 75 * parseInt(state.price) * 10000000000) / 10000000000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[state.cgtBalance, split.state, mergeAndTransfer.state, tokenBalance]);

  // call the smart contract, read the current balance value
  async function fetchContractBalances() {
    if (library) {
      const steadyContract = new Contract(
        STEADY_CONTRACT_ADDRESS,
        Steady.abi,
        library
      ) as SteadyType
      const cacheTestTokenContract = new Contract(
        CACHE_CONTRACT_ADDRESS,
        CacheGold.abi,
        library
      ) as CacheGoldType      
      const leveragedCGTContract = new Contract(
        LEVERAGED_CONTRACT_ADDRESS,
        Unsteady.abi,
        library
      ) as UnsteadyType
      try {
        const data = await steadyContract.balanceOf(account)
        const cgtData = await cacheTestTokenContract.balanceOf(account)
        const leveragedData = await leveragedCGTContract.balanceOf(account)

        dispatch({ type: 'SET_BALANCES', 
        cgtBalance: formatUnits(cgtData, 8) , 
        balance: formatUnits(data, 8),
        leveragedBalance : formatUnits(leveragedData, 8)})
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log('Error: ', err)
      }
    }
  }

   // call the smart contract, read the current balance value
   async function fetchOraclePrice() {
    if (library) {
      const rootCGTConvertorContract = new ethers.Contract(
        LOCAL_CONTRACT_ADDRESS,
        RootAlchemist.abi,
        library
      ) as RootAlchemistType

        const data = await rootCGTConvertorContract.priceFromOracle();

        dispatch({ type: 'SET_ORACLE', 
        price: formatUnits(data, 8) })
    }
  }

  // call the smart contract, send an update
  async function splitCGT() {
    if (!state.inputValue) return
    if (library) {
      dispatch({
        type: 'SET_SPLIT_LOADING',
        isSplitLoading: true,
      })
      
      split.send(parseUnits(state.inputValue,8))
      await fetchContractBalances()
      dispatch({
        type: 'SET_SPLIT_LOADING',
        isSplitLoading: false,
      })
    }
  }

  async function approveCGT() {
    if (!state.inputValue) return
    if (library) {
      dispatch({
        type: 'SET_SPLIT_APPROVE_LOADING',
        isSplitApproveLoading: true,
      })
      try{
          approve.send(LOCAL_CONTRACT_ADDRESS, parseUnits(state.inputValue,8))
      }
      catch(e){
                // eslint-disable-next-line no-console
                console.log('Error: ', e)
      }  
      dispatch({
        type: 'SET_SPLIT_APPROVE_LOADING',
        isSplitApproveLoading: false,
      })
    }
  }

  
   function approveLCGTANDSCGT() {

    dispatch({
      type: 'SET_MERGE_APPROVE_LOADING',
      isMergeApproveLoading: true,
    })
    try{
      const steadyAmount = ((parseInt(state.inputValue) * 75 * parseInt(state.price) * 10000000000) / 10000000000);

      approveAlchemistForMergeLCGT.send(LOCAL_CONTRACT_ADDRESS, parseUnits(state.inputValue,8))
      approveAlchemistForMergeSCGT.send(LOCAL_CONTRACT_ADDRESS, parseUnits(steadyAmount.toString(),8))
      
    }
    catch(e){
              // eslint-disable-next-line no-console
              console.log('Error: ', e)
    }  
    dispatch({
      type: 'SET_MERGE_APPROVE_LOADING',
      isMergeApproveLoading: false,
    })
  }

  async function mergeCGT() {
    if (!state.inputValue) return
    if (library) {
      dispatch({
        type: 'SET_MERGE_LOADING',
        isMergeLoading: true,
      })


      merge.send(parseUnits(state.inputValue,8))
      mergeAndTransfer.send(LOCAL_CONTRACT_ADDRESS, account, parseUnits(state.inputValue,8))
      await fetchContractBalances()
      dispatch({
        type: 'SET_MERGE_LOADING',
        isMergeLoading: false,
      })
    }
  }

  async function transferCGT() {
    if (!state.inputValue) return
    if (library) {


      mergeAndTransfer.send(LOCAL_CONTRACT_ADDRESS, account, parseUnits(state.inputValue,8))
      await fetchContractBalances()

    }
  }

  return (
    <Layout>
      <Heading as="h3" size="xl" isTruncated>
        Auto Metal Minter
      </Heading>

      <SimpleGrid columns={2} spacing={10}>
      <Box maxWidth="container.sm" p="8" mt="8">

      <Box
          p={5}
          shadow="md"
          borderWidth="1px"
          flex="1"
          borderRadius="md">
          <Stat>
          <StatHelpText>CGT {tokenBalance &&  formatUnits(tokenBalance, 8)} @ ${state.price}</StatHelpText>

          </Stat>
        {/* </Box> */}
        {/* <Divider my="8" borderColor="gray.400" /> */}

          <Input
            bg="white"
            type="text"
            size="lg"
            placeholder="Enter Amount in CGT Grams"
            onChange={(e) => {
              dispatch({
                type: 'SET_INPUT_VALUE',
                inputValue: e.target.value,
              })
            }}
          />
   
          <Divider my="8" borderColor="gray.400" />
          <Stack spacing={8} direction="row" align="justify">
          <Button
            size="lg"
            colorScheme="teal"
            isLoading={state.isSplitApproveLoading}
            onClick={approveCGT}
          >
           Approve
          </Button>
          <Button
            size="lg"
            colorScheme="teal"
            isLoading={state.isSplitLoading}
            onClick={splitCGT}
          >
           Split
          </Button>
          </Stack>
        </Box>
      </Box>
      <Box maxWidth="container.sm" p="8" mt="8">


        <Box
          p={5}
          shadow="md"
          borderWidth="1px"
          flex="1"
          borderRadius="md">
          <Stat>
            <StatHelpText>Steady {state.balance} - Unsteady {state.leveragedBalance}</StatHelpText>
          </Stat>
        {/* </Box> */}
        {/* <Divider my="8" borderColor="gray.400" /> */}

          <Input
            bg="white"
            type="text"
            size="lg"
            placeholder="Enter Amount in CGT Grams"
            onChange={(e) => {
              dispatch({
                type: 'SET_INPUT_VALUE',
                inputValue: e.target.value,
              })
            }}
          />
   
          <Divider my="8" borderColor="gray.400" />
          <Stack spacing={8} direction="row" align="justify">
          <Button
            size="lg"
            colorScheme="teal"
            onClick={() => approveLCGTANDSCGT()}
          >
            Approve
          </Button>
          <Button
            size="lg"
            colorScheme="teal"
            isLoading={state.isMergeLoading}
            onClick={mergeCGT}
          >
            Merge
          </Button>
          <Button
            size="lg"
            colorScheme="teal"
            onClick={transferCGT}
          >
            Redeem
          </Button>
          </Stack>
        </Box>

        </Box>
        </SimpleGrid>
        <Accordion allowToggle>
        <AccordionItem> 
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                How it works?
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
          Unsteady = 25% of CGT to split;
          <br/>
          Steady  = 75% of CGT to split in current $ value;
          </AccordionPanel>
          <AccordionPanel pb={4}>
          The minter does not take fees
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem> 
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Contract Addresses
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
          <Text fontSize="xs">Convertor Address: {LOCAL_CONTRACT_ADDRESS}</Text>
          </AccordionPanel>
        </AccordionItem>
        
      </Accordion>
    </Layout>
  )
}

export default HomeIndex
