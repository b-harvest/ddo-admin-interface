import axios from 'axios'
import { CHAIN_IDS } from 'constants/chain'
import { useAtom } from 'jotai'
import { chainIdAtomRef } from 'state/atoms'
import useSWR from 'swr'
import type { Balance } from 'types/account'
import type { APIHookReturn, ResponseViaSWR } from 'types/api'
import type { AssetInfo } from 'types/asset'

export function useAllAssetInfo(interval = 0) {
  const { data, error }: ResponseViaSWR<AssetInfo[]> = useAppSWR('/asset/info', interval)
  return returnGenerator({ data, error })
}

export function useAllBalance(address: string, interval = 0) {
  const { data, error }: ResponseViaSWR<Balance> = useAppSWR(`/acc/${address}/balance/all`, interval)
  return returnGenerator({ data, error })
}

const getBaseUrl = (chainId: CHAIN_IDS): string | undefined => {
  switch (chainId) {
    case CHAIN_IDS.MAINNET:
      return process.env.REACT_APP_MAINNET_API_ENDPOINT
    case CHAIN_IDS.MOONCAT:
      return process.env.REACT_APP_MOONCAT_API_ENDPOINT
    default:
      return process.env.REACT_APP_MAINNET_API_ENDPOINT
  }
}

const fetcher = (url: string) =>
  axios
    .get(url)
    .then((res) => {
      return res.data
    })
    .catch((e) => e)

function useAppSWR(url: string, interval = 0) {
  const [chainIdAtom] = useAtom(chainIdAtomRef)
  const { data, error } = useSWR(url ? `${getBaseUrl(chainIdAtom)}${url}` : null, fetcher, {
    refreshInterval: interval,
    suspense: true,
  })
  return { data, error }
}

function returnGenerator<T>({ data, error }: ResponseViaSWR<T>): APIHookReturn<T> {
  if (error) {
    console.log(error)
  }

  return {
    data,
    isError: error,
    isLoading: !error && !data,
  }
}
