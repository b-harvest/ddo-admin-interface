import type { GoogleUserProfile } from 'types/user'

export const isValidUser = (profileObj: GoogleUserProfile, validHostName: string) => {
  const email = profileObj.email
  const hostName = email.split('@')[1]
  return hostName === validHostName
}

export const refreshTokenSetup = async (res) => {
  // console.log(res.tokenObj)
  // Timing to renew access token
  let refreshTiming = (res.tokenObj.expires_in || 3600 - 5 * 60) * 1000

  const refreshToken = async () => {
    const newAuthRes = await res.reloadAuthResponse()
    refreshTiming = (newAuthRes.expires_in || 3600 - 5 * 60) * 1000
    //console.log('newAuthRes:', newAuthRes)
    // saveUserToken(newAuthRes.access_token);  <-- save new token
    localStorage.setItem('authToken', newAuthRes.id_token)

    // Setup the other timer after the first one
    await setTimeout(refreshToken, refreshTiming)
  }

  // Setup first refresh timer
  await setTimeout(refreshToken, refreshTiming)
}
