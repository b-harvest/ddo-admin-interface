import { useAtom } from 'jotai'
import { useGoogleLogout } from 'react-google-login'
import { userAtomRef } from 'state/atoms'

const useSignOut = ({ clientId, onComplete }: { clientId?: string; onComplete?: () => void }) => {
  const [, setUserAtom] = useAtom(userAtomRef)

  const onLogoutSuccess = async () => {
    setUserAtom({ user: null })
    if (onComplete) onComplete()
  }

  const onFailure = () => console.log('Login failed')

  const { signOut } = useGoogleLogout({
    onLogoutSuccess,
    onFailure,
    clientId: clientId ?? '',
    cookiePolicy: 'single_host_origin',
    hostedDomain: 'crescent.foundation',
  })

  return { signOut }
}

export default useSignOut
