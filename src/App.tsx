import 'App.css'
// eslint-disable-next-line no-restricted-imports
import 'react-toastify/dist/ReactToastify.min.css'

import AppHeader from 'components/AppHeader'
import AppTopBanner from 'components/AppTopBanner'
import Loader from 'components/Loader'
import { useAtom } from 'jotai'
import Accounts from 'pages/Accounts'
import Asset from 'pages/Asset'
import AuthRoute from 'pages/AuthRoute'
import Chain from 'pages/Chain'
import SignIn from 'pages/SignIn/index'
import Validators from 'pages/Validators'
import { Suspense, useEffect, useMemo } from 'react'
import { Redirect, Route, Switch, useHistory } from 'react-router-dom'
import { Slide, ToastContainer } from 'react-toastify'
import { chainIdAtomRef, userAtomRef } from 'state/atoms'
import StateUpdater from 'state/StateUpdater'
import { isTestnet } from 'utils/chain'

// No interface change
function Updaters() {
  return (
    <>
      <StateUpdater />
    </>
  )
}

function App() {
  // user
  const [userAtom] = useAtom(userAtomRef)

  // chain
  const [chainIdAtom] = useAtom(chainIdAtomRef)
  const isOnTestnet = isTestnet(chainIdAtom)
  const topBannerLabel = isOnTestnet ? `Testnet - ${chainIdAtom}` : `Mainnet`

  // app top bar
  const showAppTopBar = useMemo(() => userAtom && isOnTestnet, [userAtom, isOnTestnet])

  // scroll behavior by route history
  const history = useHistory()

  useEffect(() => {
    const unlisten = history.listen(() => {
      window.scrollTo(0, 0)
    })
    return () => {
      unlisten()
    }
  }, [history])

  return (
    <div className="App">
      {/* suspense doesn't work as long as useSWR suspense option is false */}
      <Suspense fallback={null}>
        <Updaters />
      </Suspense>

      <div className="fixed left-0 right-0 top-0 w-full" style={{ zIndex: '60' }}>
        {showAppTopBar && <AppTopBanner label={topBannerLabel} />}
        <AppHeader />
      </div>

      <main role="main" className={showAppTopBar ? 'MAIN-TOP-BAR' : 'MAIN'}>
        <Suspense fallback={<Loader />}>
          <Switch>
            <Route exact path="/auth" component={SignIn} />

            <AuthRoute path="/chain" component={Chain} />
            <AuthRoute path="/asset" component={Asset} />
            <AuthRoute path="/accounts" component={Accounts} />
            <AuthRoute path="/validators" component={Validators} />

            <Route exact path="/">
              <Redirect to="/asset" />
            </Route>
          </Switch>
        </Suspense>

        <ToastContainer
          limit={3}
          transition={Slide}
          position="top-right"
          autoClose={8000}
          hideProgressBar={false}
          closeOnClick
          closeButton={() => <div>𝗫</div>}
          toastClassName={'bg-white text-black dark:bg-black dark:text-white TYPO-BODY-M text-left'}
          newestOnTop
          rtl={false}
          pauseOnFocusLoss
          pauseOnHover
        />
      </main>
    </div>
  )
}

export default App
