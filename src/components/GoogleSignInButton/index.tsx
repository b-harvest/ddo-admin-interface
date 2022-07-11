import Button from 'components/Buttons/Button'
import { useAtom } from 'jotai'
import { isValidUser, refreshTokenSetup } from 'pages/SignIn/utils'
import { useState } from 'react'
// import { GoogleLogin } from 'react-google-login'
import { useGoogleLogin } from 'react-google-login'
import { userAtomRef } from 'state/atoms'
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
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const onSuccess = async (res) => {
    setIsLoading(false)

    if (isValidUser(res.profileObj, 'crescent.foundation')) {
      await refreshTokenSetup(res)
      setUserAtom({ user: res.profileObj as GoogleUserProfile })
      onComplete()
    } else {
      if (onRejected) onRejected()
    }
  }

  const onFailure = (res) => {
    setIsLoading(false)
    console.log('Login failed: res:', res)
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
