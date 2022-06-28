import 'App.css'

import AppHeader from 'components/AppHeader'
import Accounts from 'pages/Accounts'
import Asset from 'pages/Asset'
import { useEffect } from 'react'
import { Route, Switch, useHistory } from 'react-router-dom'

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
      <div className="fixed left-0 right-0 top-0 w-full">
        <AppHeader />
      </div>

      <main
        role="main"
        className="min-h-screen pt-[calc((1rem*2)+2.25rem+2rem)] px-4 pb-[calc(2.25rem+2rem)] md:pt-[calc((1rem*2)+2.25rem+4rem)] md:px-8"
      >
        <Switch>
          <Route exact path="/asset" component={Asset} />
          <Route exact path="/accounts" component={Accounts} />
        </Switch>
      </main>
    </div>
  )
}

export default App
