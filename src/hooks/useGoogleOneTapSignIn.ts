import { CredentialResponse, useGoogleOneTapLogin } from '@react-oauth/google'
import { useAtom } from 'jotai'
import { useState } from 'react'
import { authTokenAtomRef } from 'state/atoms'
import { isValidHd } from 'utils/jwt'

const ALLOWED_HD = 'crescent.foundation'

/** @caution cool down feature; https://developers.google.com/identity/one-tap/web/guides/features#exponential_cool_down */
const useGoogleOneTapSignIn = ({ onComplete, onFail }: { onComplete: () => void; onFail: () => void }) => {
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(true)

  const [, setAuthTokenAtom] = useAtom(authTokenAtomRef)

  /** @summary ID token as a base64-encoded JSON Web Token (JWT) string; https://developers.google.com/identity/gsi/web/reference/js-reference#credential */
  const onSuccess = (credentialResponse: CredentialResponse) => {
    setIsLoggingIn(false)
    console.log('Google Login Success', credentialResponse)

    if (credentialResponse.credential && isValidHd(credentialResponse.credential, ALLOWED_HD)) {
      setAuthTokenAtom({ authToken: credentialResponse.credential })
      onComplete()
    } else {
      onError()
    }
  }

  /** @summary user permission needed; https://myaccount.google.com/permissions?pli=1 */
  const onError = () => {
    setIsLoggingIn(false)
    console.log('Google Login Failed')
    onFail()
  }

  useGoogleOneTapLogin({
    onSuccess,
    onError,
    hosted_domain: ALLOWED_HD,
    cancel_on_tap_outside: false,
  })

  return {
    isLoggingIn,
  }
}

export default useGoogleOneTapSignIn
