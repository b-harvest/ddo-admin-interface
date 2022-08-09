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
export interface ResponseViaSWR<T> {
  data: APIResponse<T>
  error: any
}

export interface LCDResponseViaSWR<T> {
  data: T
  error: any
}

// useAPI return
export interface APIHookReturn<T> {
  data: APIResponse<T>
  error: any
  isLoading: boolean
}

export interface LCDHookReturn<T> {
  data: T
  error: any
  isLoading: boolean
}
