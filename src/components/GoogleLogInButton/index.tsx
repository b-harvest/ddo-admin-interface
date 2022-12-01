import { GoogleLogin } from '@react-oauth/google'
import { SIGN_IN_CARD_DOM_ID } from 'constants/googleSignIn'
import useGoogleSignIn from 'hooks/useGoogleSignIn'
import { useAtom } from 'jotai'
import { useMemo } from 'react'
import { isDarkModeAtomRef } from 'state/atoms'

const ALLOWED_HD = 'crescent.foundation'

/** @caution cool down feature; https://developers.google.com/identity/one-tap/web/guides/features#exponential_cool_down */
const GoogleLogInButton = ({ onComplete, onFail }: { onComplete: () => void; onFail: () => void }) => {
  const signInElement = document.getElementById(SIGN_IN_CARD_DOM_ID)
  const signInElementWidth = signInElement?.getBoundingClientRect().width

  const buttonWidth = useMemo<string>(() => {
    const width = signInElementWidth ?? 360 - 32 * 4
    return width.toString()
  }, [signInElementWidth])

  const [isDarkModeAtom] = useAtom(isDarkModeAtomRef)

  const { onSuccess, onError, onOneTapPopupClose, onPromptMomentNotification } = useGoogleSignIn({ onComplete, onFail })

  return (
    <div className="dark:border-neutral-700 dark:border dark:rounded dark:overflow-hidden">
      <GoogleLogin
        onSuccess={onSuccess}
        onError={onError}
        intermediate_iframe_close_callback={onOneTapPopupClose}
        promptMomentNotification={onPromptMomentNotification}
        theme={isDarkModeAtom ? 'filled_black' : 'outline'}
        type="standard"
        size="large"
        text="signin_with"
        shape="square"
        width={buttonWidth}
        locale="en-US"
        logo_alignment="center"
        cancel_on_tap_outside={false}
        ux_mode="popup"
        itp_support={true}
        hosted_domain={ALLOWED_HD}
        useOneTap
        context="signin"
      />
    </div>
  )
}

export default GoogleLogInButton
