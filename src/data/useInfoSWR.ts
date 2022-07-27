import axios from 'axios'
import useSWR from 'swr'

const baseUrl = process.env.REACT_APP_MAINNET_INFO_API_ENDPOINT

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
  const { data, error } = useSWR(fetch && baseUrl ? `${baseUrl}${url}` : null, fetcher, {
    refreshInterval: interval,
    // suspense: true,
  })

  return { data, error }
}
