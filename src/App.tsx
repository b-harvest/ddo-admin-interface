import 'App.css'

import AppHeader from 'components/AppHeader'
import AppTopBanner from 'components/AppTopBanner'
import Loader from 'components/Loader'
import { useAtom } from 'jotai'
import Accounts from 'pages/Accounts'
import Asset from 'pages/Asset'
import { Suspense, useEffect } from 'react'
import { Redirect, Route, Switch, useHistory } from 'react-router-dom'
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
      </main>
    </div>
  )
}

export default App
