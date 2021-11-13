import { ChakraProvider } from '@chakra-ui/react'
import {
  ChainId,
  Config,
  DAppProvider,
} from '@usedapp/core'
import type { AppProps } from 'next/app'
import React from 'react'
// import { useApollo } from '../lib/apolloClient'

// scaffold-eth's INFURA_ID, SWAP IN YOURS FROM https://infura.io/dashboard/ethereum
export const INFURA_ID = '7df83af29c4e45ffa25e3da6982e0ba2'

const config: Config = {
  readOnlyUrls: {
    [ChainId.Rinkeby]:  'https://rinkeby.infura.io/v3/'+INFURA_ID
  },
  supportedChains: [
    ChainId.Rinkeby
  ]
}

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  // const apolloClient = useApollo(pageProps)
  return (
    // <ApolloProvider client={apolloClient}>
      <DAppProvider config={config}>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </DAppProvider>
    // </ApolloProvider>
  )
}

export default MyApp
