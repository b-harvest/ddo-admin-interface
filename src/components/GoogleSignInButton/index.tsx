import Button from 'components/Button'
import { toastError } from 'components/Toast/generator'
import { useAtom } from 'jotai'
import { isValidUser, refreshTokenSetup } from 'pages/SignIn/utils'
import { useState } from 'react'
// import { GoogleLogin } from 'react-google-login'
import { useGoogleLogin } from 'react-google-login'
import { authTokenAtomRef, userAtomRef } from 'state/atoms'
import type { GoogleUserProfile } from 'types/user'

export default function GoogleSignInButton({
  clientId,
  label,
  onComplete,
  onRejected,
}: {
  clientId: string
  label: string
  onComplete: () => void
  onRejected?: () => void
}) {
  const [, setUserAtom] = useAtom(userAtomRef)
  const [, setAuthTokenAtom] = useAtom(authTokenAtomRef)

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const onSuccess = async (res) => {
    setIsLoading(false)

    if (isValidUser(res.profileObj, 'crescent.foundation')) {
      await refreshTokenSetup(res)

      setUserAtom({ user: res.profileObj as GoogleUserProfile })
      setAuthTokenAtom({ authToken: res.getAuthResponse().id_token })

      onComplete()
    } else {
      if (onRejected) onRejected()
    }
  }

  const onFailure = (res) => {
    setIsLoading(false)
    console.log('Login failed: res:', res)

    const isCookieBlocked = res.error === 'idpiframe_initialization_failed'

    const Chrome3rdPartyCookiesInfo = (
      <a
        href="https://support.google.com/chrome/answer/95647?hl=en&co=GENIE.Platform%3DDesktop"
        target="_blank"
        rel="noreferrer"
      >
        Need to enable 3rd party cookies for Google login, <span className="underline">how to?</span>
      </a>
    )

    toastError(
      <div className="text-left">
        {!isCookieBlocked && (res.details ?? res.error ?? 'Unknown error!')}
        {isCookieBlocked && Chrome3rdPartyCookiesInfo}
      </div>
    )
  }

  const { signIn } = useGoogleLogin({
    onSuccess,
    onFailure,
    clientId,
    cookiePolicy: 'single_host_origin',
    isSignedIn: true,
    hostedDomain: 'crescent.foundation',
  })

  const onClick = () => {
    setIsLoading(true)
    signIn()
  }

  return <Button label={label} onClick={onClick} isLoading={isLoading} />
}
