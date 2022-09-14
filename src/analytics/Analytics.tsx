import 'App.css'
// eslint-disable-next-line no-restricted-imports
import 'react-toastify/dist/ReactToastify.min.css'

import { EventCategory } from 'analytics/constants'
import googleAnalytics from 'analytics/googleAnalytics'
import { useAtom } from 'jotai'
import { getPageName } from 'pages'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import reportWebVitals from 'reportWebVitals'
import { chainIdAtomRef, userAtomRef } from 'state/atoms'
import { isDevEnv, isProdEnv } from 'utils/env'
import { isMobile } from 'utils/userAgent'
import { Metric } from 'web-vitals'

const LOCAL_STORAGE_KEY_GA_CLIENT_ID = 'ga-client-id'
const gaClientIdFromLocal = localStorage.getItem(LOCAL_STORAGE_KEY_GA_CLIENT_ID)

export default function Analytics() {
  // setup
  const [initialized, setInitialized] = useState<boolean>(false)
  const [userAtom] = useAtom(userAtomRef)

  useEffect(() => {
    const GA_MEASUREMENT_ID = isProdEnv()
      ? process.env.REACT_APP_GA_MEASUREMENT_ID_PROD
      : process.env.REACT_APP_GA_MEASUREMENT_ID_DEV

    if (GA_MEASUREMENT_ID) {
      googleAnalytics.initialize(GA_MEASUREMENT_ID, {
        gaOptions: { storage: 'none', storeGac: false, cliendId: gaClientIdFromLocal ?? undefined },
        // https://developers.google.com/analytics/devguides/collection/ga4/user-id?platform=websites
        gtagOptions: { debug_mode: isDevEnv(), user_id: userAtom?.googleId },
      })

      setInitialized(true)

      googleAnalytics.set({
        //   anonymizeIp: true,
        customBrowserType: isMobile
          ? 'web3' in window || 'ethereum' in window
            ? 'mobileWeb3'
            : 'mobileRegular'
          : 'desktop',
      })

      googleAnalytics.ga((tracker: any) => {
        if (tracker) {
          // https://louder.com.au/2022/06/27/client-id-in-ga4-what-is-it-and-how-to-get-it-in-your-report/
          // capturing the last 10 digits in the Client ID tells you the timestamp of first user interaction
          const clientId: string = tracker.get('clientId')
          window.localStorage.setItem(LOCAL_STORAGE_KEY_GA_CLIENT_ID, clientId)
        }
      })

      reportWebVitals(reportWebVitalsToGA)
    } else {
      console.error(`GA_MEASUREMENT_ID cannot be retrieved from env`)
    }
  }, [])

  // pageview
  const location = useLocation()
  useEffect(() => {
    if (initialized) googleAnalytics.pageview(location.pathname + location.search, [], getPageName(location.pathname))
  }, [initialized, location])

  // chain change
  const [chainIdAtom] = useAtom(chainIdAtomRef)
  useEffect(() => {
    if (initialized) googleAnalytics.set({ cd1: chainIdAtom }) // custom dimension 1
  }, [initialized, chainIdAtom])

  return <></>
}

function reportWebVitalsToGA({ name, id, delta, entries }: Metric) {
  if (isDevEnv()) console.log(`${name}(${id}): ${delta}`, entries)
  googleAnalytics.gaCommandSendTiming(
    EventCategory.WEB_VITALS,
    name,
    Math.round(name === 'CLS' ? delta * 1000 : delta),
    id
  )
}
