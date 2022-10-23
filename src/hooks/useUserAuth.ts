import { EventName } from 'analytics/constants'
import mixpanel from 'analytics/mixpanel'
import { useAtom } from 'jotai'
import { isValidUser, setupRefreshToken } from 'pages/SignIn/utils'
import { useCallback } from 'react'
import { authTokenAtomRef, userAtomRef } from 'state/atoms'
import { GoogleUserProfile } from 'types/user'

const useUserAuth = ({ onComplete, onRejected }: { onComplete: () => void; onRejected?: () => void }) => {
  const [, setUserAtom] = useAtom(userAtomRef)
  const [, setAuthTokenAtom] = useAtom(authTokenAtomRef)

  const onAuthSuccess = useCallback(
    async (res) => {
      const profile: GoogleUserProfile = res.profileObj

      if (isValidUser(profile, 'crescent.foundation')) {
        await setupRefreshToken(res, setAuthTokenAtom)

        setUserAtom({ user: profile as GoogleUserProfile })
        setAuthTokenAtom({ authToken: res.getAuthResponse().id_token })

        /** @summary mixpanel user identification */
        mixpanel.identify(profile)
        mixpanel.track(EventName.USER_IDENTIFIED, { profile })

        onComplete()
      } else {
        if (onRejected) onRejected()
      }
    },
    [onComplete, onRejected, setAuthTokenAtom, setUserAtom]
  )

  return {
    onAuthSuccess,
  }
}

export default useUserAuth
