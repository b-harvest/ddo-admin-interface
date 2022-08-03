import axios from 'axios'
import { CHAIN_IDS } from 'constants/chain'
import { useAtom } from 'jotai'
import { chainIdAtomRef } from 'state/atoms'
import useSWR from 'swr'
// import type { AlertStatus } from 'types/alert'
import type { APIHookReturn, LCDHookReturn, LCDResponseViaSWR, ResponseViaSWR } from 'types/api'

type DataType = 'backend' | 'rpc-rest'

// tmp - rpc url things will be removed
const CRE_MAINNET_RPC_REST_API_URL = `https://mainnet.crescent.network:1317`
const CRE_TESTNET_RPC_REST_API_URL = `https://testnet-endpoint.crescent.network/api/crescent`

const getBaseUrl = ({ chainId, type }: { chainId: CHAIN_IDS; type: DataType }): string | undefined => {
  switch (chainId) {
    case CHAIN_IDS.MAINNET:
      return type === 'backend' ? process.env.REACT_APP_MAINNET_V2_API_ENDPOINT : CRE_MAINNET_RPC_REST_API_URL
    case CHAIN_IDS.MOONCAT:
      return type === 'backend' ? process.env.REACT_APP_MOONCAT_V2_API_ENDPOINT : CRE_TESTNET_RPC_REST_API_URL
    default:
      return undefined
  }
}

// should throw error to get returned as error from useSWR hook
const fetcher = (url: string) => axios.get(url).then((res) => res.data)

function handleError(error: any) {
  if (error) {
    let msg: string
    console.group()
    if (error.response) {
      // request sent, but the server responded out of the range of 2xx status code.
      console.log('Res data if any :', error.response.data)
      console.log('Res status : ', error.response.status)
      console.log('Res headers : ', error.response.headers)
      msg = `Error occured - ${error.response.data?.message ?? 'Unknown error'}`
    } else if (error.request) {
      // request sent, but no response, `error.request` is XMLHttpRequest instance
      console.log('Request was : ', error.request)
      msg = `Server is not responding currently.`
    } else {
      // request has some problems and occurs error
      console.log('Error msg : ', error.message)
      msg = `Invalid request`
    }
    console.log('Error config : ', error.config)
    // the below msg will be used in Toast
    error.msg = msg
    console.groupEnd()
  }

  return error
}

export function willFetch(value?: string): boolean {
  return value !== undefined && value.length > 0
}

export function returnGenerator<T>({ data, error }: ResponseViaSWR<T>): APIHookReturn<T> {
  return {
    data,
    error: handleError(error),
    isLoading: !error && !data,
  }
}

export function lcdReturnGenerator<T>({ data, error }: LCDResponseViaSWR<T>): LCDHookReturn<T> {
  return {
    data,
    error: handleError(error),
    isLoading: !error && !data,
  }
}

export default function useAppSWR(
  url: string,
  {
    interval = 0,
    type = 'backend',
    fetch = true,
  }: {
    interval?: number
    type?: DataType
    fetch?: boolean
  }
) {
  const [chainIdAtom] = useAtom(chainIdAtomRef)
  const baseUrl = getBaseUrl({ chainId: chainIdAtom, type })

  // doesn't use suspense as true currently to handle error with Toast, not ErrorBoundary
  // see https://swr.vercel.app/docs/suspense
  // see discussion https://github.com/vercel/swr/discussions/959
  const { data, error } = useSWR(baseUrl && fetch ? `${baseUrl}${url}` : null, fetcher, {
    refreshInterval: interval,
    // suspense: true,
  })

  return { data, error }
}
