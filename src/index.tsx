import './index.css'
import '@reach/dialog/styles.css'

import { GoogleOAuthProvider } from '@react-oauth/google'
import App from 'App'
import Loader from 'components/Loader'
import { Provider } from 'jotai'
import ErrorBoundary from 'pages/ErrorBoundary'
import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { HashRouter } from 'react-router-dom'

const onScriptLoadSuccess = () => {
  console.log('onScriptLoadSuccess')
}

const onScriptLoadError = () => {
  console.log('onScriptLoadError')
}

ReactDOM.render(
  <React.StrictMode>
    <Provider>
      <GoogleOAuthProvider
        clientId={process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID ?? ''}
        onScriptLoadSuccess={onScriptLoadSuccess}
        onScriptLoadError={onScriptLoadError}
      >
        <HashRouter>
          <ErrorBoundary>
            {/* suspense doesn't work as long as useSWR suspense option is false */}
            <Suspense fallback={<Loader />}>
              <App />
            </Suspense>
          </ErrorBoundary>
        </HashRouter>
      </GoogleOAuthProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root') as HTMLElement
)
