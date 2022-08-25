import axios from 'axios'
import { handleError } from 'data/useAppSWR'
import { LSVVoteWarnPost } from 'types/lsv'

const api = axios.create({
  baseURL: process.env.REACT_APP_MAINNET_INFO_API_ENDPOINT,
})

const catchError = (error) => {
  handleError(error)
}

export const postLSVEvent = (data: LSVVoteWarnPost) =>
  api.post(`/post/${data.event_type}`, { params: data.json }).catch(catchError)
