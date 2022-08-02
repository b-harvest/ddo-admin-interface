import BigNumber from 'bignumber.js'
import AmountOfDate from 'components/AmountOfDate'
import { TimeTick } from 'components/BarChart'
import BarChart from 'components/BarChart'
import SelectTab from 'components/SelectTab'
import { GLOW_CRE } from 'constants/style'
import { DATE_FORMAT } from 'constants/time'
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

export default function VolumeChart({
  chartData,
  highlightTime,
  onClick,
}: {
  chartData: VolUSDByDate[]
  highlightTime?: number
  onClick?: (time: number | undefined) => void
}) {
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
  const [volumeTimeHover, setVolumeTimeHover] = useState<string | undefined>()

  const headAmt = useMemo(() => {
    return new BigNumber(
      volumeHover
        ? volumeHover
        : highlightTime
        ? volUSDChartList.find((item) => item.time === highlightTime)?.value ?? 0
        : volUSDChartList.at(-1)?.value ?? 0
    )
  }, [volumeHover, volUSDChartList, highlightTime])

  const headLabel = useMemo<string>(
    () => (volumeTimeHover ? dayjs(volumeTimeHover) : dayjs(highlightTime)).format(DATE_FORMAT),
    [volumeTimeHover, highlightTime]
  )

  return (
    <BarChart
      height={220}
      minHeight={360}
      data={volUSDChartList}
      highlightTime={highlightTime}
      color={GLOW_CRE}
      setValue={setVolumeHover}
      setLabel={setVolumeTimeHover}
      value={volumeHover}
      label={volumeTimeHover}
      chartTimeTick={chartTimeTick}
      onClick={onClick}
      topLeft={<AmountOfDate title="Volume 24h" className="mb-4" value={headAmt} dateLabel={headLabel} />}
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
