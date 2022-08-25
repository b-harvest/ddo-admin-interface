import axios from 'axios'
import { handleError } from 'data/useAppSWR'
import { LSVPenaltyConfirmPost, LSVVoteWarnPost } from 'types/lsv'

const api = axios.create({
  baseURL: process.env.REACT_APP_MAINNET_INFO_API_ENDPOINT,
})

const catchError = (error) => {
  handleError(error)
}

export const postLSVVoteWarn = (data: LSVVoteWarnPost) =>
  api.post(`/post/${data.event_type}`, { params: data.json }).catch(catchError)

export const postLSVPenaltyConfirm = (data: LSVPenaltyConfirmPost) =>
  api.post(`/post/confirm/${data.eid}`, { params: data.json }).catch(catchError)
