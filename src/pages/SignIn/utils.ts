import bus from 'bus'
import { EventBusKeys } from 'bus/constants'
import type { GoogleUserProfile } from 'types/user'

export const isValidUser = (profileObj: GoogleUserProfile, validHostName: string) => {
  const email = profileObj.email
  const hostName = email.split('@')[1]
  return hostName === validHostName
}

export const setupRefreshToken = async (res, setAuthTokenAtom: (update: { authToken: string | null }) => void) => {
  let refreshTiming = (res.tokenObj.expires_in ?? 3600 - 5 * 60) * 1000

  const refreshToken = async () => {
    const newAuthRes = await res.reloadAuthResponse()
    refreshTiming = (newAuthRes.expires_in || 3600 - 5 * 60) * 1000
    setAuthTokenAtom({ authToken: newAuthRes.id_token })

    // Setup another timer
    await setTimeout(refreshToken, refreshTiming)
  }

  // Setup first refresh timer
  await setTimeout(refreshToken, refreshTiming)

  bus.register(EventBusKeys.RESPONSE_401, async () => {
    await refreshToken()
  })
}
