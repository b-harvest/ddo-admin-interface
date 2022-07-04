import axios from 'axios'
import { CHAIN_IDS } from 'constants/chain'
import { useAtom } from 'jotai'
import { chainIdAtomRef } from 'state/atoms'
import useSWR from 'swr'
import type { APIHookReturn, LCDHookReturn, LCDResponseViaSWR, ResponseViaSWR } from 'types/api'

type DataType = 'backend' | 'rpc-rest'

// tmp - cosmos rpc url things will be removed
const CRE_MAINNET_RPC_REST_API_URL = `https://mainnet.crescent.network:1317`
const CRE_TESTNET_RPC_REST_API_URL = `https://testnet-endpoint.crescent.network/api/crescent`
// const COSMOS_MAINNET_RPC_REST_API_URL = `https://cosmos.crescent.network:1317`

const getBaseUrl = ({ chainId, type }: { chainId: CHAIN_IDS; type: DataType }): string | undefined => {
  switch (chainId) {
    case CHAIN_IDS.MAINNET:
      return type === 'backend' ? process.env.REACT_APP_MAINNET_API_ENDPOINT : CRE_MAINNET_RPC_REST_API_URL
    case CHAIN_IDS.MOONCAT:
      return type === 'backend' ? process.env.REACT_APP_MOONCAT_API_ENDPOINT : CRE_TESTNET_RPC_REST_API_URL
    default:
      return type === 'backend' ? process.env.REACT_APP_MAINNET_API_ENDPOINT : CRE_MAINNET_RPC_REST_API_URL
  }
}

const fetcher = (url: string) =>
  axios
    .get(url)
    .then((res) => {
      return res.data
    })
    .catch((e) => e)

export function returnGenerator<T>({ data, error }: ResponseViaSWR<T>): APIHookReturn<T> {
  if (error) {
    console.log(error)
  }

  return {
    data,
    error,
    isLoading: !error && !data,
  }
}

export function lcdReturnGenerator<T>({ data, error }: LCDResponseViaSWR<T>): LCDHookReturn<T> {
  if (error) {
    console.log(error)
  }

  return {
    data,
    error,
    isLoading: !error && !data,
  }
}

export default function useAppSWR(url: string, interval = 0, type = 'backend' as DataType) {
  const [chainIdAtom] = useAtom(chainIdAtomRef)
  const { data, error } = useSWR(url ? `${getBaseUrl({ chainId: chainIdAtom, type })}${url}` : null, fetcher, {
    refreshInterval: interval,
    suspense: true,
  })
  return { data, error }
}
