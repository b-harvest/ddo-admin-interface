import 'App.css'

import AppHeader from 'components/AppHeader'
import Loader from 'components/Loader'
import Accounts from 'pages/Accounts'
import Asset from 'pages/Asset'
import { Suspense, useEffect } from 'react'
import { Redirect, Route, Switch, useHistory } from 'react-router-dom'
import StateUpdater from 'state/updater'

// No interface change
function Updaters() {
  return (
    <>
      <StateUpdater />
    </>
  )
}

function App() {
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

      <div className="fixed left-0 right-0 top-0 w-full">
        <AppHeader />
      </div>

      <main
        role="main"
        className="min-h-screen pt-[calc((1rem*2)+2.25rem+2rem)] px-4 pb-[calc(2.25rem+2rem)] md:pt-[calc((1rem*2)+2.25rem+4rem)] md:px-8"
      >
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
