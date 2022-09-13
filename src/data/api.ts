import axios, { AxiosError, AxiosResponse } from 'axios'
import bus from 'bus'
import { EventBusKeys } from 'bus/constants'
import { toastError } from 'components/Toast/generator'
import { handleError } from 'data/utils'
import { LSVPenaltyConfirmPost, LSVReliabilityWarnPost, LSVVoteWarnPost, NewLSVPost } from 'types/lsv'

const api = axios.create({
  baseURL: process.env.REACT_APP_MAINNET_INFO_API_ENDPOINT,
})

const RETRY_MAX = 1
let retry = 0

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (axios.isAxiosError(error) && retry < RETRY_MAX) {
      if (error.response?.status === 401) {
        // try revalidate JWT
        await bus.dispatch(EventBusKeys.RESPONSE_401)
        retry += 1
        return new Promise((resolve) => {
          resolve(axios(error.config))
        })
      }
    }
    return Promise.reject(error)
  }
)

export default api

// Error should be typed
const catchError = (error: Error | AxiosError): null => {
  const handled = handleError(error)
  toastError(handled.msg)
  return null
}

type PostResponseData = {
  result: 'success' | 'error'
  message?: string
}

const mapPostReturn = async <T>(data: T, post: (data: T) => Promise<AxiosResponse<PostResponseData, any> | null>) => {
  const res = await post(data)
  return { success: res?.data.result === 'success', message: res?.data.message }
}

export const postLSVPenalty = (data: LSVVoteWarnPost | LSVReliabilityWarnPost) =>
  mapPostReturn(data, (data) => api.post<PostResponseData>(`/a1/post/${data.event_type}`, data.json).catch(catchError))

export const postLSVPenaltyConfirm = (data: LSVPenaltyConfirmPost) =>
  mapPostReturn(data, (data) => api.post<PostResponseData>(`/a1/post/confirm/${data.eid}`, data.json).catch(catchError))

export const postNewLSV = (data: NewLSVPost) =>
  mapPostReturn(data, (data) => api.post<PostResponseData>(`/a1/post/lsv/new`, data.json).catch(catchError))
