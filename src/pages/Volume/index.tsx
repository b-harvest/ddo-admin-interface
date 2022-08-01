import AppPage from 'components/AppPage'
import useChartData from 'hooks/useChartData'
import VolumneChart from 'pages/Overview/sections/VolumeChart'
import { useParams } from 'react-router-dom'

import VolumeByPairChart from './sections/VolumeByPairChart'

export default function Volume() {
  const { id }: { id: string } = useParams()
  const { volUSDChartData } = useChartData()

  return (
    <AppPage>
      <div className="space-y-20">
        <VolumneChart chartData={volUSDChartData} highlightTime={Number(id)} />
        <VolumeByPairChart chartData={volUSDChartData} date={Number(id)} />
      </div>
    </AppPage>
  )
}
