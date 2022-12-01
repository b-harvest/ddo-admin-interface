import { googleLogout } from '@react-oauth/google'
import { useAtom } from 'jotai'
import { authTokenAtomRef } from 'state/atoms'

const useGoogleSignOut = ({ onComplete }: { onComplete: () => void }) => {
  const [, setAuthTokenAtom] = useAtom(authTokenAtomRef)

  const signOut = () => {
    googleLogout()
    setAuthTokenAtom({ authToken: null })
    onComplete()
  }

  return {
    signOut,
  }
}

export default useGoogleSignOut
