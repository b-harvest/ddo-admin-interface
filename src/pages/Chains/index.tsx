import BigNumber from 'bignumber.js'
import AppPage from 'components/AppPage'
import { TimeTick } from 'components/BarChart'
import BarChart from 'components/BarChart'
import dummyChartData from 'components/LineChart/dummy/data.json'
import { GLOW_CRE } from 'constants/style'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { useMemo, useState } from 'react'
import type { GenericChartEntry } from 'types/chart'

dayjs.extend(weekOfYear)

function unixToType(unix: number, type: 'month' | 'week') {
  const date = dayjs.unix(unix).utc()

  switch (type) {
    case 'month':
      return date.format('YYYY-MM')
    case 'week':
      let week = String(date.week())
      if (week.length === 1) {
        week = `0${week}`
      }
      return `${date.year()}-${week}`
  }
}

export function useTransformedVolumeData(chartData: GenericChartEntry[] | undefined, type: 'month' | 'week') {
  return useMemo(() => {
    if (!chartData) return []

    const record: Record<string, GenericChartEntry> = {}

    chartData.forEach(({ time, value }: { time: number; value: number }) => {
      const recordKey = unixToType(time, type)

      if (record[recordKey]) {
        record[recordKey].value += value
      } else {
        record[recordKey] = {
          time,
          value,
        }
      }
    })

    return Object.values(record)
  }, [chartData, type])
}

export default function Chains() {
  const [chartTimeTick, setChartTimeTick] = useState<TimeTick>(TimeTick.Daily)

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

  const weeklyVolumeData = useTransformedVolumeData(chartData, 'week')
  const monthlyVolumeData = useTransformedVolumeData(chartData, 'month')

  const [volumeHover, setVolumeHover] = useState<number | undefined>()
  const [volumeTimeLabelHover, setVolumeTimeLabelHover] = useState<string | undefined>()
  return (
    <AppPage>
      <BarChart
        height={220}
        minHeight={332}
        data={
          chartTimeTick === TimeTick.Monthly
            ? monthlyVolumeData
            : chartTimeTick === TimeTick.Weekly
            ? weeklyVolumeData
            : chartData
        }
        color={GLOW_CRE}
        setValue={setVolumeHover}
        setLabel={setVolumeTimeLabelHover}
        value={volumeHover}
        label={volumeTimeLabelHover}
        activeWindow={chartTimeTick}
      />
    </AppPage>
  )
}
