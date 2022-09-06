import GoogleAnalytics from 'analytics/googleAnalytics'
import { handleError } from 'data/useAppSWR'
import React, { ErrorInfo, PropsWithChildren } from 'react'
type ErrorBoundaryState = {
  error: Error | null
}

export default class ErrorBoundary extends React.Component<PropsWithChildren<unknown>, ErrorBoundaryState> {
  constructor(props: PropsWithChildren<unknown>) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // updateServiceWorker()
    //   .then(async (registration) => {
    //     // We want to refresh only if we detect a new service worker is waiting to be activated.
    //     // See details about it: https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle
    //     if (registration?.waiting) {
    //       await registration.unregister()

    //       // Makes Workbox call skipWaiting(). For more info on skipWaiting see: https://developer.chrome.com/docs/workbox/handling-service-worker-updates/
    //       registration.waiting.postMessage({ type: 'SKIP_WAITING' })

    //       // Once the service worker is unregistered, we can reload the page to let
    //       // the browser download a fresh copy of our app (invalidating the cache)
    //       window.location.reload()
    //     }
    //   })
    //   .catch((error) => {
    //     console.error('Failed to update service worker', error)
    //   })
    return { error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    GoogleAnalytics.sendEvent('error', {
      description: error.toString() + errorInfo.toString(),
      fatal: true,
    })
    handleError(error)
  }

  render(): JSX.Element {
    const { error } = this.state

    if (error !== null) {
      return (
        <>
          <div className="w-full h-full flex justify-center items-center text-black dark:text-white">Error Page</div>
        </>
      )
    }
    return this.props.children as JSX.Element
  }
}
