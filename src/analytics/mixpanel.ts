import { EventName } from 'analytics/constants'
import Mixpanel, { Callback, Config, Dict, RequestOptions } from 'mixpanel-browser'
import type { GoogleUserProfile } from 'types/user'

const initialize = (token: string, config?: Partial<Config> | undefined) => {
  Mixpanel.init(token, config)
}

const identify = (profile: GoogleUserProfile) => {
  const id = profile.email

  Mixpanel.identify(id)
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
  track,
}

export default mixpanel
