import { EventName } from 'analytics/constants'
import { setProfile } from 'analytics/mixpanelApi'
import Mixpanel, { Callback, Config, Dict, RequestOptions } from 'mixpanel-browser'
import type { GoogleUserProfile } from 'types/user'

let $token: string

const initialize = (token: string, config?: Partial<Config> | undefined) => {
  Mixpanel.init(token, config)
  $token = token
}

const identify = async (profile: GoogleUserProfile) => {
  const id = profile.email
  Mixpanel.identify(id)
  //   await Mixpanel.register_once(profile)

  await setProfile([
    {
      $token,
      $distinct_id: id,
      $set: profile,
    },
  ])
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
