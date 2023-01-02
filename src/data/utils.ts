import axios, { AxiosError } from 'axios'
import { CHAIN_IDS } from 'constants/chain'
import type { APIHookReturn, HandledError, LCDHookReturn, LCDResponseViaSWR, ResponseViaSWR } from 'types/api'
import { isDevEnv } from 'utils/env'

export function handleError(error: Error | AxiosError): HandledError {
  let msg = ''
  const handledError: HandledError = { error, msg }

  if (error) {
    if (axios.isAxiosError(error)) {
      //console.group()

      if (error.response) {
        // request sent, but the server responded out of the range of 2xx status code.
        console.log('Res data if any :', error.response.data)
        console.log('Res status : ', error.response.status)
        if (isDevEnv()) console.log('Res headers : ', error.response.headers)

        msg = `Error occured \n${error.response.data?.message ?? error.response.data ?? 'Unknown error'}`
      } else if (error.request) {
        // request sent, but no response, `error.request` is XMLHttpRequest instance
        if (isDevEnv()) {
          //console.log('Request was : ', error.request)
        }

        msg = `Server is not responding currently.`
      } else {
        // request has some problems and occurs error
        //console.log('Error msg : ', error.message)
        msg = `Invalid request`
      }
      if (isDevEnv()) {
        //console.log('Error config : ', error.config)
      }

      console.groupEnd()
    }

    // the below msg will be used in Toast
    handledError.msg = msg
    return handledError
  }

  return handledError
}

export function willFetch(value?: string): boolean {
  return value !== undefined && value.length > 0
}

export function returnGenerator<T>({ data, error, mutate }: ResponseViaSWR<T>): APIHookReturn<T> {
  return {
    data,
    error: handleError(error),
    isLoading: !error && !data,
    mutate,
  }
}

export function lcdReturnGenerator<T>({ data, error }: LCDResponseViaSWR<T>): LCDHookReturn<T> {
  return {
    data,
    error: handleError(error),
    isLoading: !error && !data,
  }
}

export type DataType = 'backend' | 'rpc-rest'

// const CRE_MAINNET_RPC_REST_API_URL = `https://mainnet.crescent.network:1317`
// const CRE_TESTNET_RPC_REST_API_URL = `https://testnet-endpoint.crescent.network/api/crescent`
/** @summayr https://docs.crescent.network/other-information/network-configurations */
const CRE_MAINNET_RPC_REST_API_URL = 'https://mainnet.crescent.network:1317'
const CRE_TESTNET_RPC_REST_API_URL = 'https://testnet-endpoint.crescent.network:1317'

export const getBaseUrl = ({ chainId, type }: { chainId: CHAIN_IDS; type: DataType }): string | undefined => {
  switch (chainId) {
    case CHAIN_IDS.MAINNET:
      return type === 'backend' ? process.env.REACT_APP_MAINNET_V3_API_ENDPOINT : CRE_MAINNET_RPC_REST_API_URL
    case CHAIN_IDS.MOONCAT:
      return type === 'backend' ? process.env.REACT_APP_MOONCAT_V3_API_ENDPOINT : CRE_TESTNET_RPC_REST_API_URL
    default:
      return undefined
  }
}
