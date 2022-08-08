import AppPage from 'components/AppPage'
import DatePicker from 'components/DatePicker'
import useChartData from 'hooks/useChartData'
import TVLChart from 'pages/components/TVLChart'
import usePages from 'pages/hooks/usePages'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import TVLByPoolChart from './sections/TVLByPoolChart'

export default function Volume() {
  // route & date
  const { id }: { id: string } = useParams()
  const { routeTVLByTime } = usePages()

  const [date, setDate] = useState<number>(Number(id))
  useEffect(() => setDate(Number(id)), [id])

  const onDateChange = (date: Date) => routeTVLByTime(date.getTime())

  // chart data
  const { tvlUSDChartData, getMinDate, getMaxDate, tvlUSDDataLoading } = useChartData()

  return (
    <AppPage>
      <div className="flex justify-end mb-4">
        <DatePicker
          selected={new Date(date)}
          minDate={getMinDate(tvlUSDChartData)}
          maxDate={getMaxDate(tvlUSDChartData)}
          onChange={onDateChange}
        />
      </div>

      <div className="space-y-20">
        <TVLChart
          chartData={tvlUSDChartData}
          highlightTime={date}
          onClick={routeTVLByTime}
          isLoading={tvlUSDDataLoading}
        />
        <TVLByPoolChart chartData={tvlUSDChartData} date={date} />
      </div>
    </AppPage>
  )
}
