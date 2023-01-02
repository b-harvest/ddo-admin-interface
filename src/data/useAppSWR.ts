import axios from 'axios'
import { useAtom } from 'jotai'
import { chainIdAtomRef } from 'state/atoms'
import useSWR from 'swr'

import { DataType, getBaseUrl } from './utils'
// import type { AlertStatus } from 'types/alert'

// should throw error to get returned as error from useSWR hook
const fetcher = async (url: string) => {
  try {
    // if (url.startsWith('https://testnet-endpoint.crescent.network:1317')) {
    //   url = url.split('https://testnet-endpoint.crescent.network:1317')[1]
    // }
    //console.log(` 헤헷 ${url}`)
    const res = await axios.get(url)
    return res.data
  } catch (e) {
    console.log('[ERROR] fetcher', e)
    return null
  }
}
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
