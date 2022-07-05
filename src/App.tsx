import 'App.css'
// eslint-disable-next-line no-restricted-imports
import 'react-toastify/dist/ReactToastify.min.css'

import AppHeader from 'components/AppHeader'
import AppTopBanner from 'components/AppTopBanner'
import Loader from 'components/Loader'
import { useAtom } from 'jotai'
import Accounts from 'pages/Accounts'
import Asset from 'pages/Asset'
import { Suspense, useEffect } from 'react'
import { Redirect, Route, Switch, useHistory } from 'react-router-dom'
import { Slide, ToastContainer } from 'react-toastify'
import { chainIdAtomRef, isTestnetAtomRef } from 'state/atoms'
import StateUpdater from 'state/StateUpdater'

// No interface change
function Updaters() {
  return (
    <>
      <StateUpdater />
    </>
  )
}

function App() {
  // chain
  const [chainIdAtom] = useAtom(chainIdAtomRef)
  const [isTestnetAtom] = useAtom(isTestnetAtomRef)
  const topBannerLabel = isTestnetAtom ? `Testnet - ${chainIdAtom}` : `Mainnet`

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
        {isTestnetAtom ? <AppTopBanner label={topBannerLabel} /> : null}
        <AppHeader />
      </div>

      <main role="main" className="MAIN" style={{ marginTop: isTestnetAtom ? '1.5rem' : '0' }}>
        <Suspense fallback={<Loader />}>
          <Switch>
            <Route exact path="/asset" component={Asset} />
            <Route exact path="/accounts" component={Accounts} />
            <Route>
              {/* tmp */}
              <Redirect to="/accounts" />
            </Route>
          </Switch>
        </Suspense>

        <ToastContainer
          limit={3}
          transition={Slide}
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick
          closeButton={() => <div>𝗫</div>}
          // className={'top-20'}
          toastClassName={'bg-white text-black'}
          // toastStyle={{ top: '3.5rem' }}
          newestOnTop={true}
          rtl={false}
          pauseOnFocusLoss
          pauseOnHover
        />
      </main>
    </div>
  )
}

export default App
