import axios from 'axios'
import { useAtom } from 'jotai'
import { chainNameAtomRef } from 'state/atoms'
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

const getBaseUrl = (chainName: string): string | undefined => {
  switch (chainName) {
    case 'mainnet':
      return process.env.REACT_APP_MAINNET_API_ENDPOINT
    case 'testnet':
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
  const [chainNameAtom] = useAtom(chainNameAtomRef)
  const { data, error } = useSWR(url ? `${getBaseUrl(chainNameAtom)}${url}` : null, fetcher, {
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
