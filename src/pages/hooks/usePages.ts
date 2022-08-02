import { useHistory } from 'react-router-dom'

const usePages = () => {
  const history = useHistory()

  const routeTVLByTime = (time: number | undefined) => {
    if (time) history.push(`/tvl/${time}`)
  }

  const routeVolumeByTime = (time: number | undefined) => {
    if (time) history.push(`/volume/${time}`)
  }

  return { routeTVLByTime, routeVolumeByTime }
}

export default usePages
