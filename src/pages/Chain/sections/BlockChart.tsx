import BigNumber from 'bignumber.js'
// import ComposedBarChart from 'components/ComposedBarChart'
import ComposedBarChart from 'components/ComposedBarChart/ant'
import Indicator from 'components/Indicator'
import dummyChartData from 'components/LineChart/dummy/data.json'
import { CHART_COLOR_MAP } from 'constants/style'
import { useMemo, useState } from 'react'
import type { ComposedChartEntry } from 'types/chart'
import { firstCharToUpperCase } from 'utils/text'

type DexDailyData = { date: number; tvlUSD: string; volumeUSD: string }

const rawList = () => {
  const {
    data: { uniswapDayDatas },
  } = dummyChartData as { data: { uniswapDayDatas: DexDailyData[] } }

  if (!uniswapDayDatas) return []

  return uniswapDayDatas.map((item) => ({
    date: item.date,
    bank: item.tvlUSD,
    'liquidity/swap': item.volumeUSD,
    'liquidity/deposit': item.volumeUSD,
  }))
}

export default function BlockChart() {
  // chart data - this is using dummy data for component test
  const chartData: ComposedChartEntry[] = useMemo(() => {
    return rawList().reduce((totalList: ComposedChartEntry[], data) => {
      const types = getEventTypes(data)
      const dailyList = types.reduce((accm: ComposedChartEntry[], type) => {
        accm.push({
          time: Number((data.date / 1000).toFixed(0)),
          type,
          value: Number((data[type] / 100000000).toFixed(0)),
        })
        return accm
      }, [])
      return totalList.concat(dailyList)
    }, [])
  }, [])

  const colorMap = useMemo(() => {
    const map =
      rawList().length > 0
        ? getEventTypes(rawList()[0])
            .map((type, i) => ({ [type]: CHART_COLOR_MAP[i] ?? CHART_COLOR_MAP.at(-1) }))
            .reduce((accm, set) => ({ ...accm, ...set }), {})
        : undefined
    return map
  }, [])

  // volume total
  const [blockHeightHover, setBlockHeightHover] = useState<number | undefined>()

  const blockChartHeight = useMemo(() => {
    return 'Height ' + new BigNumber(blockHeightHover ?? chartData.at(-1)?.time ?? 0).toFormat(0)
  }, [blockHeightHover, chartData])

  const allEventsHover = useMemo(() => {
    return chartData
      .filter((item) => item.time === (blockHeightHover ?? chartData.at(-1)?.time ?? 0))
      .sort((a, b) => b.value - a.value)
  }, [chartData, blockHeightHover])

  const topEventHover = useMemo(() => {
    return allEventsHover[0] ?? undefined
  }, [allEventsHover])

  return (
    <div className="w-full flex flex-col md:flex-row justify-between items-stretch space-y-4 md:space-y-0 md:space-x-2">
      {colorMap && (
        <ComposedBarChart
          className="grow shrink"
          height={220}
          data={chartData}
          colorMap={colorMap}
          setLabel={setBlockHeightHover}
          label={blockHeightHover}
          topLeft={
            topEventHover && (
              <TopEvent title="Top event" label={blockChartHeight} event={topEventHover} colorMap={colorMap} />
            )
          }
        />
      )}

      <div className="grow-0 shrink-0 md:basis-[25%] flex flex-col items-start space-y-2 !font-medium bg-neutral-900 px-6 py-4 rounded-xl dark:bg-neutral-800">
        <Indicator title="All events" light={true}>
          {allEventsHover.map((event, i) => (
            <div key={event.type} className="flex items-center space-x-2">
              {colorMap && <div className="w-2 h-2 rounded-full" style={{ background: colorMap[event.type] }}></div>}
              <div className="TYPO-BODY-XS md:TYPO-BODY-S">
                {firstCharToUpperCase(event.type)}{' '}
                <span className="FONT-MONO !font-bold">{new BigNumber(event.value).toFormat(0)}</span>
              </div>
            </div>
          ))}
        </Indicator>
      </div>
    </div>
  )
}

function TopEvent({
  title,
  label,
  className,
  event,
  colorMap,
}: {
  className?: string
  title: string
  label?: string
  event: ComposedChartEntry
  colorMap: { [x: string]: string }
}) {
  return (
    <Indicator title={title} light={true} label={label} className={className}>
      <div className="flex TYPO-BODY-XL !font-bold">
        <div className="flex items-center space-x-3">
          <div>
            {firstCharToUpperCase(event.type)} <span className="FONT-MONO !font-black">{event.value}</span>
          </div>
          <div className="w-3 h-3 rounded-full" style={{ background: colorMap[event.type] }}></div>
        </div>
      </div>
    </Indicator>
  )
}

function getEventTypes(rawData: { [key: string]: number | string }) {
  return Object.keys(rawData).filter((key) => key !== 'date')
}
