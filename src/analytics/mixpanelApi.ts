import axios from 'axios'

const api = axios.create({
  baseURL: 'https://api.mixpanel.com',
  headers: {
    accept: 'text/plain',
    'content-type': 'application/json',
  },
})

// api.interceptors.request.use((config) => {
//   if (config.headers) {
//     config.headers.common['Content-Type'] = null
//     config.headers.post['Content-Type'] = null
//   }
//   return config
// })

export const setProfile = (body: { $token: string; $distinct_id: string; $set: { email: string; name: string } }[]) =>
  api.post('/engage', body, {
    transformRequest: (data, headers) => {
      // delete headers?.common['Content-Type']
      // delete headers?.post['Content-Type']
      if (headers) {
        headers.post['content-type'] = 'application/json'
      }
    },
  })
