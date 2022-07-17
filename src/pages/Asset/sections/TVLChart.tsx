import BigNumber from 'bignumber.js'
import AmountOfDate from 'components/AmountOfDate'
import LineChart from 'components/LineChart'
import chartData from 'components/LineChart/dummy/data.json'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import type { GenericChartEntry } from 'types/chart'

export default function TVLChart() {
  // chart data
  const tvlChartList: GenericChartEntry[] = useMemo(() => {
    type DexDailyData = { id: string; date: number; tvlUSD: string; volumeUSD: string }
    const {
      data: { uniswapDayDatas },
    } = chartData as { data: { uniswapDayDatas: DexDailyData[] } }

    if (!uniswapDayDatas) return []

    return uniswapDayDatas.map((data) => {
      return {
        time: data.date * 1000,
        value: Number(new BigNumber(data.tvlUSD).toFixed(0)),
      }
    })
  }, [])

  // tvl total
  const [tvlHover, setTvlHover] = useState<number | undefined>()
  const [tvlTimeLabelHover, setTvlTimeLabelHover] = useState<number | undefined>()

  const tvlChartHeadAmt = useMemo(() => {
    return tvlHover ? new BigNumber(tvlHover) : new BigNumber(tvlChartList.at(-1)?.value ?? 0)
  }, [tvlHover, tvlChartList])

  return (
    <LineChart
      height={220}
      minHeight={360}
      data={tvlChartList}
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
