import { CredentialResponse, PromptMomentNotification } from '@react-oauth/google'
import mixpanel from 'analytics/mixpanel'
import bus from 'bus'
import { EventBusKeys } from 'bus/constants'
import { useAtom } from 'jotai'
import { useCallback, useState } from 'react'
import { authTokenAtomRef } from 'state/atoms'
import { getJwtExpiresIn, getUserProfile, isValidHd } from 'utils/jwt'

const ALLOWED_HD = 'crescent.foundation'

const useGoogleSignIn = ({
  onComplete,
  onFail,
  onCancel,
}: {
  onComplete: () => void
  onFail: () => void
  onCancel?: () => void
}) => {
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(true)

  const [, setAuthTokenAtom] = useAtom(authTokenAtomRef)

  const removeAuthToken = useCallback(() => {
    setAuthTokenAtom({ authToken: null })
  }, [setAuthTokenAtom])

  const setupTokenExpiry = useCallback(
    (jwt: string) => {
      setTimeout(removeAuthToken, getJwtExpiresIn(jwt))
      bus.register(EventBusKeys.RESPONSE_401, () => removeAuthToken())
    },
    [removeAuthToken]
  )

  /** @summary user permission needed; https://myaccount.google.com/permissions?pli=1 */
  const onError = useCallback(() => {
    setIsLoggingIn(false)
    console.log('Google Login Failed')
    onFail()
  }, [onFail])

  /** @summary ID token as a base64-encoded JSON Web Token (JWT) string; https://developers.google.com/identity/gsi/web/reference/js-reference#credential */
  const onSuccess = useCallback(
    (credentialResponse: CredentialResponse) => {
      setIsLoggingIn(false)
      console.log('Google Login Success')

      const credential = credentialResponse.credential

      if (credential && isValidHd(credential, ALLOWED_HD)) {
        setupTokenExpiry(credential)
        setAuthTokenAtom({ authToken: credential })
        /** @summary mixpanel user identification */
        console.log(getUserProfile(credential))
        //TODO: jihon
        //mixpanel.identifyUser(getUserProfile(credential))
        onComplete()
      } else {
        onError()
      }
    },
    [onComplete, onError, setAuthTokenAtom, setupTokenExpiry]
  )

  const onOneTapPopupClose = useCallback(() => {
    setIsLoggingIn(false)
    console.log('Google One Tap Login Closed')
  }, [])

  /** https://developers.google.com/identity/gsi/web/reference/js-reference#PromptMomentNotification */
  const onPromptMomentNotification = useCallback(
    (notification: PromptMomentNotification) => {
      setIsLoggingIn(false)
      const type = notification.getMomentType()
      if (type === 'dismissed' && notification.getDismissedReason() === 'cancel_called') {
        onCancel?.()
      }
    },
    [onCancel]
  )

  return {
    isLoggingIn,
    onSuccess,
    onError,
    onOneTapPopupClose,
    onPromptMomentNotification,
  }
}

export default useGoogleSignIn
