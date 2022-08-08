import BigNumber from 'bignumber.js'
import AmountOfDate from 'components/AmountOfDate'
import LineChart from 'components/LineChart'
import { DATE_FORMAT } from 'constants/time'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import type { TVLUSDByDate } from 'types/accounts'
import type { GenericChartEntry } from 'types/chart'

export default function TVLChart({
  isLoading,
  chartData,
  highlightTime,
  onClick,
}: {
  isLoading: boolean
  chartData: TVLUSDByDate[]
  highlightTime?: number
  onClick?: (time: number | undefined) => void
}) {
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
  const [tvlTimeHover, setTvlTimeHover] = useState<number | undefined>()

  const headAmt = useMemo(() => {
    return new BigNumber(
      tvlHover
        ? tvlHover
        : highlightTime
        ? tvlUSDChartList.find((item) => item.time === highlightTime)?.value ?? 0
        : tvlUSDChartList.at(-1)?.value ?? 0
    )
  }, [tvlHover, tvlUSDChartList, highlightTime])

  const headLabel = useMemo<string>(
    () => (tvlTimeHover ? dayjs(tvlTimeHover) : dayjs(highlightTime)).format(DATE_FORMAT),
    [tvlTimeHover, highlightTime]
  )

  return (
    <LineChart
      isLoading={isLoading}
      height={220}
      minHeight={360}
      data={tvlUSDChartList}
      highlightTime={highlightTime}
      value={tvlHover}
      setValue={setTvlHover}
      label={tvlTimeHover}
      setLabel={setTvlTimeHover}
      onClick={onClick}
      topLeft={<AmountOfDate title="TVL" value={headAmt} dateLabel={headLabel} className="mb-4" />}
    ></LineChart>
  )
}
