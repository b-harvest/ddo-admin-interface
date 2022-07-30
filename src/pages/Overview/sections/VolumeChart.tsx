import BigNumber from 'bignumber.js'
import AmountOfDate from 'components/AmountOfDate'
import { TimeTick } from 'components/BarChart'
import BarChart from 'components/BarChart'
import SelectTab from 'components/SelectTab'
import { GLOW_CRE } from 'constants/style'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import type { VolUSDByDate } from 'types/accounts'
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

export default function VolumeChart({ chartData }: { chartData: VolUSDByDate[] }) {
  // chart time tick selected
  const [chartTimeTick, setChartTimeTick] = useState<TimeTick>(TimeTick.Daily)
  const handleChartTimeTickSelect = (value: TimeTick) => setChartTimeTick(value)

  // chartData
  const volUSDChartList = useMemo<GenericChartEntry[]>(() => {
    return chartData.map((item) => {
      return {
        time: item.date,
        value: item.vol,
      }
    })
  }, [chartData])

  // volume total
  const [volumeHover, setVolumeHover] = useState<number | undefined>()
  const [volumeTimeLabelHover, setVolumeTimeLabelHover] = useState<string | undefined>()

  const volumeChartHeadAmt = useMemo(() => {
    return volumeHover ? new BigNumber(volumeHover) : new BigNumber(volUSDChartList.at(-1)?.value ?? 0)
  }, [volumeHover, volUSDChartList])

  return (
    <BarChart
      height={220}
      minHeight={360}
      data={volUSDChartList}
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
          className="!TYPO-BODY-S"
          getVerticalIfMobile={true}
        />
      }
    />
  )
}
