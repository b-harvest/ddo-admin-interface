import axios, { AxiosError } from 'axios'
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

interface PostResponseData {
  result: 'success' | 'error'
  message?: string
}

export const postLSVVoteWarn = (data: LSVVoteWarnPost) =>
  api.post<PostResponseData>(`/a1/post/${data.event_type}`, data.json).catch(catchError)

export const postLSVPenaltyConfirm = (data: LSVPenaltyConfirmPost) =>
  api.post<PostResponseData>(`/a1/post/confirm/${data.eid}`, data.json).catch(catchError)
