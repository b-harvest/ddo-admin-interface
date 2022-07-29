import BigNumber from 'bignumber.js'
import AmountOfDate from 'components/AmountOfDate'
import LineChart from 'components/LineChart'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import type { TVLUSDByDate } from 'types/accounts'
import type { GenericChartEntry } from 'types/chart'

export default function TVLChart({ chartData }: { chartData: TVLUSDByDate[] }) {
  // chart data
  const tvlUSDChartList = useMemo<GenericChartEntry[]>(() => {
    return chartData.map((item) => {
      return {
        time: item.date,
        value: item.tvl,
      }
    })
  }, [chartData])

  // tvl total
  const [tvlHover, setTvlHover] = useState<number | undefined>()
  const [tvlTimeLabelHover, setTvlTimeLabelHover] = useState<number | undefined>()

  const tvlChartHeadAmt = useMemo(() => {
    return tvlHover ? new BigNumber(tvlHover) : new BigNumber(tvlUSDChartList.at(-1)?.value ?? 0)
  }, [tvlHover, tvlUSDChartList])

  return (
    <LineChart
      height={220}
      minHeight={360}
      data={tvlUSDChartList}
      value={tvlHover}
      setValue={setTvlHover}
      label={tvlTimeLabelHover}
      setLabel={setTvlTimeLabelHover}
      topLeft={
        <AmountOfDate
          title="TVL"
          value={tvlChartHeadAmt}
          dateLabel={dayjs(tvlTimeLabelHover).format('MMM DD, YYYY')}
          className="mb-4"
        />
      }
    ></LineChart>
  )
}
