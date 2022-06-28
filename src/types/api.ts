// raw response
export interface APIResponse<T> {
  readonly result: string
  readonly data: T
  readonly curTimestamp: number
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

// useAPI return
export interface APIHookReturn<T> {
  data: APIResponse<T>
  isError: any
  isLoading: boolean
}
