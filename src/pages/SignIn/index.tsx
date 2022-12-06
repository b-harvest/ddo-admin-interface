import AppPage from 'components/AppPage'
import GlowingCard from 'components/GlowingCard'
import GoogleLogInButton from 'components/GoogleLogInButton'
import Logo from 'components/Logo'
import { toastError } from 'components/Toast/generator'
import { SIGN_IN_CARD_DOM_ID } from 'constants/googleSignIn'
import { CRESCENT_LOGO_IMG_URL } from 'constants/resources'
import { useAtom } from 'jotai'
import { useCallback, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { authTokenAtomRef } from 'state/atoms'

export default function SignIn() {
  const history = useHistory()
  const goToHome = () => history.push('/')

  const toast3rdPartyCookieAllow = useCallback(() => {
    const Chrome3rdPartyCookiesInfo = (
      <div className="text-left">
        <a
          href="https://support.google.com/chrome/answer/95647?hl=en&co=GENIE.Platform%3DDesktop"
          target="_blank"
          rel="noreferrer"
        >
          Need to enable 3rd party cookies for Google login, <span className="underline">how to?</span>
        </a>
      </div>
    )

    toastError(Chrome3rdPartyCookiesInfo)
  }, [])

  const [authTokenAtom] = useAtom(authTokenAtomRef)
  useEffect(() => {
    if (authTokenAtom) goToHome()
  }, [])

  return (
    <AppPage>
      <GlowingCard className="w-full md:w-[28rem] mt-[20vh] m-auto">
        <div id={SIGN_IN_CARD_DOM_ID}>
          <div className="flex flex-col justify-center items-center gap-4 text-center mb-10">
            <Logo className="h-12 py-2" src={CRESCENT_LOGO_IMG_URL} />
            <h2
              className="inline-flex justify-start items-center TYPO-H2 md:TYPO-H2 dark:text-white"
              style={{ wordBreak: 'keep-all' }}
            >
              Welcome back, <br />
              are you Admin?
            </h2>
          </div>

          <div className="w-full flex justify-center">
            <GoogleLogInButton onComplete={goToHome} onFail={toast3rdPartyCookieAllow} />
          </div>
        </div>
      </GlowingCard>
    </AppPage>
  )
}
