import { useMemo } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

const usePages = () => {
  const history = useHistory()
  const location = useLocation()

  const searchMap = useMemo<Map<string, string> | undefined>(
    () =>
      location.search
        ?.split('?')[1]
        ?.split('&')
        .reduce((map, item) => {
          const set = item.split('=') as [string, string]
          map.set(set[0], set[1])
          return map
        }, new Map<string, string>()),
    [location]
  )

  const routeTVLByTime = (time: number | undefined) => {
    if (time) history.push(`/tvl/${time}`)
  }

  const routeVolumeByTime = (time: number | undefined) => {
    if (time) history.push(`/volume/${time}`)
  }

  return { history, location, searchMap, routeTVLByTime, routeVolumeByTime }
}

export default usePages
