import AppPage from 'components/AppPage'
import Card from 'components/Card'
import GoogleSignInButton from 'components/GoogleSignInButton'
import Logo from 'components/Logo'
import { CRESCENT_LOGO_IMG_URL } from 'constants/resources'
import { useHistory } from 'react-router-dom'

const clientId = process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID

export default function SignIn() {
  const history = useHistory()

  const goToHome = () => history.push('/')
  const alertRejected = () => alert('Your email is not allowed to access')

  return (
    <AppPage className="flex justify-center items-center px-8 pt-[20%]">
      <Card className="w-full md:w-[60%]">
        <div className="flex flex-col justify-center items-center space-x-4 mb-10">
          <Logo className="h-12 py-2" src={CRESCENT_LOGO_IMG_URL} />
          <h2 className="inline-flex justify-start items-center TYPO-H2 md:TYPO-H2 dark:text-white">
            Welcome back, <br />
            are you Admin?
          </h2>
        </div>

        {clientId ? (
          <GoogleSignInButton
            clientId={clientId}
            label="Log in with Google"
            onComplete={goToHome}
            onRejected={alertRejected}
          />
        ) : null}
      </Card>
    </AppPage>
  )
}
