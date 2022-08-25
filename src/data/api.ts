import axios from 'axios'
import { handleError } from 'data/useAppSWR'
import { LSVPenaltyConfirmPost, LSVVoteWarnPost } from 'types/lsv'

const api = axios.create({
  baseURL: process.env.REACT_APP_MAINNET_INFO_API_ENDPOINT,
})

export default api

// Error should be typed
const catchError = (error) => {
  handleError(error)
  return error
}

interface PostResponseData {
  result: string
}

export const postLSVVoteWarn = (data: LSVVoteWarnPost) =>
  api.post<PostResponseData>(`/a1/post/${data.event_type}`, { params: data.json }).catch(catchError)

export const postLSVPenaltyConfirm = (data: LSVPenaltyConfirmPost) =>
  api.post<PostResponseData>(`/a1/post/confirm/${data.eid}`, { params: data.json }).catch(catchError)
