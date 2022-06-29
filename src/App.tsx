import 'App.css'

import AppHeader from 'components/AppHeader'
import Loader from 'components/Loader'
import { TESTNET_CHAIN_NAME } from 'constants/names'
import { useAtom } from 'jotai'
import Accounts from 'pages/Accounts'
import Asset from 'pages/Asset'
import { Suspense, useEffect } from 'react'
import { Redirect, Route, Switch, useHistory } from 'react-router-dom'
import { chainNameAtomRef } from 'state/atoms'
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
  const [chainNameAtom] = useAtom(chainNameAtomRef)
  const isTestnet = chainNameAtom === TESTNET_CHAIN_NAME

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
      {/* {isTestnet ? <AppTopBanner label={chainNameAtom} /> : null} */}

      <div className="fixed left-0 right-0 top-0 w-full" style={{ zIndex: '60' }}>
        <AppHeader />
      </div>

      <main role="main" className="MAIN">
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
