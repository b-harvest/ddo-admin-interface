import Button from 'components/Button'
import { toastError } from 'components/Toast/generator'
import useUserAuth from 'hooks/useUserAuthLegacy'
import { useState } from 'react'
// import { GoogleLogin } from 'react-google-login'
import { useGoogleLogin } from 'react-google-login'

export default function GoogleSignInButtonLegacy({
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
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { onAuthSuccess } = useUserAuth({ onComplete, onRejected })

  const onSuccess = async (res) => {
    setIsLoading(false)
    onAuthSuccess(res)
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
