import { useAtom } from 'jotai'
import { GoogleLogout } from 'react-google-login'
import { useHistory } from 'react-router-dom'
import { userAtomRef } from 'state/atoms'

const clientId = process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID

export default function GoogleSignOut() {
  const history = useHistory()
  const [, setUserAtom] = useAtom(userAtomRef)

  const goToSignInPage = () => {
    history.push('/auth')
  }

  const onSuccess = () => {
    console.log('Logout made successfully')
    setUserAtom({ user: null })
    goToSignInPage()
  }

  return (
    <>
      {clientId ? (
        <GoogleLogout className="w-full" clientId={clientId} buttonText="Logout" onLogoutSuccess={onSuccess} />
      ) : null}
    </>
  )
}
