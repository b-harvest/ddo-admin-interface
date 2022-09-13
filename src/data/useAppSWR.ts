import axios from 'axios'
import { CHAIN_IDS } from 'constants/chain'
import { useAtom } from 'jotai'
import { chainIdAtomRef } from 'state/atoms'
import useSWR from 'swr'
// import type { AlertStatus } from 'types/alert'

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

export default function useAppSWR(
  url: string,
  {
    interval = 0,
    type = 'backend',
    fetch = true,
    suspense = false,
  }: {
    interval?: number
    type?: DataType
    fetch?: boolean
    suspense?: boolean
  }
) {
  const [chainIdAtom] = useAtom(chainIdAtomRef)
  const baseUrl = getBaseUrl({ chainId: chainIdAtom, type })

  // doesn't use suspense as true currently to handle error with Toast, not ErrorBoundary
  // see https://swr.vercel.app/docs/suspense
  // see discussion https://github.com/vercel/swr/discussions/959
  const { data, error, mutate } = useSWR(baseUrl && fetch ? `${baseUrl}${url}` : null, fetcher, {
    refreshInterval: interval,
    suspense,
  })

  return { data, error, mutate }
}
