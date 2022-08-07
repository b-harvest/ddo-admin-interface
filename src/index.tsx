import './index.css'
import '@reach/dialog/styles.css'

import App from 'App'
import Loader from 'components/Loader'
import { Provider } from 'jotai'
import ErrorBoundary from 'pages/ErrorBoundary'
import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { HashRouter } from 'react-router-dom'
import reportWebVitals from 'reportWebVitals'

ReactDOM.render(
  <React.StrictMode>
    <Provider>
      <HashRouter>
        <ErrorBoundary>
          {/* suspense doesn't work as long as useSWR suspense option is false */}
          <Suspense fallback={<Loader />}>
            <App />
          </Suspense>
        </ErrorBoundary>
      </HashRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root') as HTMLElement
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
