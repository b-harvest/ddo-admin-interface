import BigNumber from 'bignumber.js'
import AmountOfDate from 'components/AmountOfDate'
import { TimeTick } from 'components/BarChart'
import BarChart from 'components/BarChart'
import dummyChartData from 'components/LineChart/dummy/data.json'
import SelectTab from 'components/SelectTab'
import { GLOW_CRE } from 'constants/style'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import type { GenericChartEntry } from 'types/chart'

const VOLUME_CHART_WINDOW_TAB_ITEMS = [
  {
    label: 'D',
    value: TimeTick.Daily,
  },
  {
    label: 'W',
    value: TimeTick.Weekly,
  },
  {
    label: 'M',
    value: TimeTick.Monthly,
  },
]

export default function VolumeChart() {
  // chart time tick selected
  const [chartTimeTick, setChartTimeTick] = useState<TimeTick>(TimeTick.Daily)
  const handleChartTimeTickSelect = (value: TimeTick | undefined) => setChartTimeTick(value ?? TimeTick.Daily)

  // chart data
  const chartData: GenericChartEntry[] = useMemo(() => {
    type DexDailyData = { id: string; date: number; tvlUSD: string; volumeUSD: string }
    const {
      data: { uniswapDayDatas },
    } = dummyChartData as { data: { uniswapDayDatas: DexDailyData[] } }

    if (!uniswapDayDatas) return []

    return uniswapDayDatas.map((data) => {
      return {
        time: data.date * 1000,
        value: Number(new BigNumber(data.tvlUSD).toFixed(0)),
      }
    })
  }, [])

  // volume total
  const [volumeHover, setVolumeHover] = useState<number | undefined>()
  const [volumeTimeLabelHover, setVolumeTimeLabelHover] = useState<string | undefined>()

  const volumeChartHeadAmt = useMemo(() => {
    return volumeHover ? new BigNumber(volumeHover) : new BigNumber(chartData.at(-1)?.value ?? 0)
  }, [volumeHover, chartData])

  return (
    <BarChart
      height={220}
      minHeight={360}
      data={chartData}
      color={GLOW_CRE}
      setValue={setVolumeHover}
      setLabel={setVolumeTimeLabelHover}
      value={volumeHover}
      label={volumeTimeLabelHover}
      chartTimeTick={chartTimeTick}
      topLeft={
        <AmountOfDate
          title="Volume 24h"
          className="mb-4"
          value={volumeChartHeadAmt}
          dateLabel={dayjs(volumeTimeLabelHover).format('MMM DD, YYYY')}
        />
      }
      topRight={
        <SelectTab<TimeTick>
          tabItems={VOLUME_CHART_WINDOW_TAB_ITEMS}
          selectedValue={chartTimeTick}
          onChange={handleChartTimeTickSelect}
          className=""
          getVerticalIfMobile={true}
        />
      }
    />
  )
}
