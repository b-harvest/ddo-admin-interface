import axios from 'axios'
import type { GoogleUserProfile } from 'types/user'

const api = axios.create({
  baseURL: 'https://api.mixpanel.com',
})

delete api.defaults.headers.common['Content-Type']

export const setProfile = (body: [{ $token: string; $distinct_id: string; $set: GoogleUserProfile }]) =>
  api.post('/engage#profile-set', body)
