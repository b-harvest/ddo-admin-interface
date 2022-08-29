import axios from 'axios'
import { CHAIN_IDS } from 'constants/chain'
import { useAtom } from 'jotai'
import { chainIdAtomRef } from 'state/atoms'
import useSWR from 'swr'

const getBaseUrl = ({ chainId }: { chainId: CHAIN_IDS }): string | undefined => {
  switch (chainId) {
    case CHAIN_IDS.MAINNET:
      return process.env.REACT_APP_MAINNET_INFO_API_ENDPOINT
    case CHAIN_IDS.MOONCAT:
      return undefined
    default:
      return undefined
  }
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data)

export default function useInfoSWR(
  url: string,
  {
    interval = 0,
    fetch = true,
  }: {
    interval?: number
    fetch?: boolean
  }
) {
  const [chainIdAtom] = useAtom(chainIdAtomRef)
  const baseUrl = getBaseUrl({ chainId: chainIdAtom })

  const { data, error, mutate } = useSWR(baseUrl && fetch ? `${baseUrl}${url}` : null, fetcher, {
    refreshInterval: interval,
    // suspense: true,
  })

  return { data, error, mutate }
}
