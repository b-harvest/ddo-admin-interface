import axios, { AxiosError, AxiosResponse } from 'axios'
import { toastError } from 'components/Toast/generator'
import { handleError } from 'data/useAppSWR'
import { LSVPenaltyConfirmPost, LSVVoteWarnPost } from 'types/lsv'

const api = axios.create({
  baseURL: process.env.REACT_APP_MAINNET_INFO_API_ENDPOINT,
})

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

// export const postLSVVoteWarn = (data: LSVVoteWarnPost) =>
//   api.post<PostResponseData>(`/a1/post/${data.event_type}`, data.json).catch(catchError)

// export const postLSVPenaltyConfirm = (data: LSVPenaltyConfirmPost) =>
//   api.post<PostResponseData>(`/a1/post/confirm/${data.eid}`, data.json).catch(catchError)

export const postLSVVoteWarn = (data: LSVVoteWarnPost) =>
  mapPostReturn(data, (data) => api.post<PostResponseData>(`/a1/post/${data.event_type}`, data.json).catch(catchError))

export const postLSVPenaltyConfirm = (data: LSVPenaltyConfirmPost) =>
  mapPostReturn(data, (data) => api.post<PostResponseData>(`/a1/post/confirm/${data.eid}`, data.json).catch(catchError))
