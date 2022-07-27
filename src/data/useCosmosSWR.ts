import axios from 'axios'
import useSWR from 'swr'
import { COSMOS_API_PROVIDER, COSMOS_CHAIN_NAME, restAPIUrlOf } from 'utils/chainRegistry'

// swr setting
const getBaseUrl = ({ chainName }: { chainName: COSMOS_CHAIN_NAME }): string | undefined => {
  const provider = COSMOS_API_PROVIDER[chainName]
  return restAPIUrlOf(chainName, provider)
}

// should throw error to get returned as error from useSWR hook
const fetcher = (url: string) => axios.get(url).then((res) => res.data)

export default function useCosmosSWR(
  url: string,
  {
    chainName,
    interval = 0,
    fetch = true,
  }: {
    chainName: COSMOS_CHAIN_NAME
    interval?: number
    fetch?: boolean
  }
) {
  const baseURL = getBaseUrl({ chainName })
  // doesn't use suspense as true currently to handle error with Toast, not ErrorBoundary
  // see https://swr.vercel.app/docs/suspense
  // see discussion https://github.com/vercel/swr/discussions/959
  const { data, error } = useSWR(baseURL && fetch ? `${baseURL}${url}` : null, fetcher, {
    refreshInterval: interval,
    // suspense: true,
  })

  return { data, error }
}
