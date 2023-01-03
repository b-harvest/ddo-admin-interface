import { EventName } from 'analytics/constants'
import Mixpanel, { Callback, Config, Dict, RequestOptions } from 'mixpanel-browser'
import type { GoogleUserProfile, UserProfile } from 'types/user'

const initialize = (token: string, config?: Partial<Config> | undefined) => {
  Mixpanel.init(token, config)
}

/** @todo remove legacy (old google signin response) */
const identify = (profile: GoogleUserProfile) => {
  const id = profile.email

  Mixpanel.identify(id)
  Mixpanel.register_once({
    ...profile,
  })
}

const identifyUser = (profile: UserProfile) => {
  const id = profile.email
  console.log(id)
  Mixpanel.identify(id)
  console.log(id)
  Mixpanel.register_once({
    ...profile,
  })
}

const track = (
  eventName: EventName,
  properties?: Dict | undefined,
  optionsOrCallback?: RequestOptions | Callback | undefined,
  callback?: Callback | undefined
) => {
  Mixpanel.track(eventName, properties, optionsOrCallback, callback)
}

const mixpanel = {
  initialize,
  identify,
  identifyUser,
  track,
}

export default mixpanel
