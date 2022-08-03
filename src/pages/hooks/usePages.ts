import type { Page } from 'pages'
import { findPage, getPageName } from 'pages'
import { useMemo } from 'react'
import { useHistory, useLocation, useParams } from 'react-router-dom'

const usePages = () => {
  const history = useHistory()
  const location = useLocation()
  const params = useParams()

  const pathname = useMemo<string>(
    () =>
      Object.keys(params).length ? location.pathname.slice(0, location.pathname.lastIndexOf('/')) : location.pathname,
    [location, params]
  )

  const page = useMemo<Page | undefined>(() => findPage(pathname), [pathname])
  const pageName = useMemo<string>(() => getPageName(pathname), [pathname])

  // common
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

  // utils
  const routeTVLByTime = (time: number | undefined) => {
    if (time) history.push(`/tvl/${time}`)
  }

  const routeVolumeByTime = (time: number | undefined) => {
    if (time) history.push(`/volume/${time}`)
  }

  return { history, location, pathname, page, pageName, searchMap, routeTVLByTime, routeVolumeByTime }
}

export default usePages
