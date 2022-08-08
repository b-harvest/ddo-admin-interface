import AppPage from 'components/AppPage'
import DatePicker from 'components/DatePicker'
import useChartData from 'hooks/useChartData'
import VolumeChart from 'pages/components/VolumeChart'
import usePages from 'pages/hooks/usePages'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import VolumeByPairChart from './sections/VolumeByPairChart'

export default function Volume() {
  const { id }: { id: string } = useParams()
  const { routeVolumeByTime } = usePages()

  const [date, setDate] = useState<number>(Number(id))
  useEffect(() => setDate(Number(id)), [id])

  const onDateChange = (date: Date) => routeVolumeByTime(date.getTime())

  // chart data
  const { volUSDChartData, getMinDate, getMaxDate, volUSDDataLoading } = useChartData()

  return (
    <AppPage>
      <div className="flex justify-end mb-4">
        <DatePicker
          selected={new Date(date)}
          minDate={getMinDate(volUSDChartData)}
          maxDate={getMaxDate(volUSDChartData)}
          onChange={onDateChange}
        />
      </div>

      <div className="space-y-20">
        <VolumeChart
          chartData={volUSDChartData}
          highlightTime={Number(id)}
          onClick={routeVolumeByTime}
          isLoading={volUSDDataLoading}
        />
        <VolumeByPairChart chartData={volUSDChartData} date={Number(id)} />
      </div>
    </AppPage>
  )
}
