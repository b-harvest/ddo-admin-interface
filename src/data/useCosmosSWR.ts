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

// function handleError(error: any) {
//   if (error) {
//     let msg: string
//     console.group()
//     if (error.response) {
//       // request sent, but the server responded out of the range of 2xx status code.
//       console.log('Res data if any :', error.response.data)
//       console.log('Res status : ', error.response.status)
//       console.log('Res headers : ', error.response.headers)
//       msg = `Error occured - ${error.response.data?.message ?? 'Unknown error'}`
//     } else if (error.request) {
//       // request sent, but no response, `error.request` is XMLHttpRequest instance
//       console.log('Request was : ', error.request)
//       msg = `Server is not responding currently.`
//     } else {
//       // request has some problems and occurs error
//       console.log('Error msg : ', error.message)
//       msg = `Invalid request`
//     }
//     console.log('Error config : ', error.config)
//     // the below msg will be used in Toast
//     error.msg = msg
//     console.groupEnd()
//   }

//   return error
// }

// export function lcdReturnGenerator<T>({ data, error }: LCDResponseViaSWR<T>): LCDHookReturn<T> {
//   return {
//     data,
//     error: handleError(error),
//     isLoading: !error && !data,
//   }
// }

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
