import axios from 'axios'
import useSWR from 'swr'

export function useAllAssetInfo(interval = 0) {
  const { data, error } = useAppSWR('/asset/info', interval)
  return returnGenerator({ data, error })
}

const getBaseUrl = (chainName: string): string | undefined => {
  switch (chainName) {
    case 'mainnet':
      return process.env.REACT_APP_MAINNET_API_ENDPOINT
    case 'mooncat':
      return process.env.REACT_APP_MOONCAT_API_ENDPOINT
    case 'persian':
      return process.env.REACT_APP_PERSIAN_API_ENDPOINT
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
  const chainName = 'mainnet' // this is tmp, .. should be dynamic using store
  const { data, error } = useSWR(url ? `${getBaseUrl(chainName)}${url}` : null, fetcher, { refreshInterval: interval })
  console.log('data', data)

  return { data, error }
}

function returnGenerator<T>({ data, error }: { data: T; error: any }) {
  if (error) {
    console.log(error)
  }

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  }
}
