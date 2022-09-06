// https://github.com/PriceRunner/react-ga4#reactgagaargs

import ReactGA from 'react-ga4'
import { GaOptions, InitOptions, UaEventOptions } from 'react-ga4/types/ga4'

const initialize = (
  GA_MEASUREMENT_ID: InitOptions[] | string,
  options?: {
    legacyDimensionMetric?: boolean
    nonce?: string
    testMode?: boolean
    gaOptions?: GaOptions | any
    gtagOptions?: any
  }
) => {
  ReactGA.initialize(GA_MEASUREMENT_ID, options)
}

const pageview = (path: string, _?: string[], title?: string) => {
  ReactGA.send({ hitType: 'pageview', page: path, title })
  // ReactGA.send('pageview')
}

const set = (fieldsObject: any) => {
  ReactGA.set(fieldsObject)
}

const ga = (...args: any) => {
  ReactGA.ga(...args)
}

const gaCommandSendTiming = (timingCategory: any, timingVar: any, timingValue: any, timingLabel: any) => {
  ReactGA._gaCommandSendTiming(timingCategory, timingVar, timingValue, timingLabel)
}

const sendEvent = (event: string | UaEventOptions, params?: any) => {
  ReactGA.event(event, params)
}

const GoogleAnalytics = {
  initialize,
  pageview,
  set,
  ga,
  gaCommandSendTiming,
  sendEvent,
}

export default GoogleAnalytics
