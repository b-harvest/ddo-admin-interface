import { AxiosError } from 'axios'

// backend response
export interface APIResponse<T> {
  readonly result: string
  readonly data: T
  readonly curTimestamp: number
  readonly syncTimestamp?: number
}

export interface APIError {
  readonly result: string
  readonly message: string
}

// useSWR return
export type SWRBoundMutate<T> = (
  data?: T,
  options?: { optimisticData: T; revalidate: boolean; populateCache: boolean; rollbackOnError: boolean }
) => void

export interface ResponseViaSWR<T> {
  data: APIResponse<T>
  error: Error | AxiosError
  mutate: SWRBoundMutate<T>
}

export interface LCDResponseViaSWR<T> {
  data: T
  error: Error | AxiosError
}

// useAPI return
export interface APIHookReturn<T> {
  data: APIResponse<T>
  error: Error | AxiosError
  isLoading: boolean
  mutate: SWRBoundMutate<T>
}

export interface LCDHookReturn<T> {
  data: T
  error: Error | AxiosError
  isLoading: boolean
}
