import BigNumber from 'bignumber.js'
import ComposedBarChart from 'components/ComposedBarChart'
import Indicator from 'components/Indicator'
import dummyChartData from 'components/LineChart/dummy/data.json'
import { GLOW_CRE, GLOW_DARK_CRE } from 'constants/style'
import { useMemo, useState } from 'react'
import type { BlockEvent } from 'types/chain'
import type { ComposedChartEntry } from 'types/chart'

const BLOCK_CHART_COLORS = ['#ddd', GLOW_CRE, GLOW_DARK_CRE]

export default function BlockChart() {
  // chart data - this is using dummy data for component test
  const chartData: ComposedChartEntry[] = useMemo(() => {
    type DexDailyData = { id: string; date: number; tvlUSD: string; volumeUSD: string }
    const {
      data: { uniswapDayDatas },
    } = dummyChartData as { data: { uniswapDayDatas: DexDailyData[] } }

    if (!uniswapDayDatas) return []

    return uniswapDayDatas.map((data) => {
      return {
        time: data.date / 1000,
        bank: Number(new BigNumber(data.tvlUSD)) / 100000000,
        'liquidity/swap': Number(new BigNumber(data.volumeUSD)) / 100000000,
        'liquidity/deposit': Number(new BigNumber(data.date)) / 100000000,
      }
    })
  }, [])

  const dataKeys = useMemo(() => {
    if (chartData.length < 1) return []
    return Object.keys(chartData[0]).filter((key) => key !== 'time')
  }, [chartData])

  // volume total
  const [dataIndex, setDataIndex] = useState<number | undefined>(-1)
  const [blockHeightHover, setBlockHeightHover] = useState<number | undefined>()

  const blockChartHeight = useMemo(() => {
    return 'Block #' + new BigNumber(blockHeightHover ?? chartData.at(-1)?.time ?? 0).toFormat(0)
  }, [blockHeightHover, chartData])

  const blockEvents = useMemo(() => {
    const block = chartData.at(dataIndex ?? -1)
    return block
      ? dataKeys.map((key) => {
          return {
            name: firstCharToUpperCase(key),
            count: block[key],
          }
        })
      : []
  }, [dataKeys, chartData, dataIndex])

  const mappedEvents = useMemo(() => topBlockEvents(blockEvents), [blockEvents])

  return (
    <div className="w-full flex flex-col md:flex-row justify-between items-stretch space-y-4 md:space-y-0 md:space-x-2">
      <ComposedBarChart
        className="grow shrink"
        height={220}
        minHeight={360}
        data={chartData}
        dataKeys={dataKeys}
        tickFormatter={() => ''}
        colors={BLOCK_CHART_COLORS}
        setIndex={setDataIndex}
        setLabel={setBlockHeightHover}
        index={dataIndex}
        label={blockHeightHover}
        topLeft={
          <TopEvent
            title="Top event block-wide"
            label={blockChartHeight}
            className="mb-4"
            mappedEvents={mappedEvents}
          />
        }
      />

      <div className="grow-0 shrink-0 md:basis-[25%] flex flex-col items-start space-y-2 !font-medium bg-neutral-900 px-6 py-4 rounded-xl dark:bg-neutral-800">
        <Indicator title="All events" light={true}>
          {mappedEvents.map((item) => (
            <div key={item.name} className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full" style={{ background: item.color }}></div>
              <div className="TYPO-BLOCK-XS">
                {item.name} <span className="FONT-MONO !font-bold">{item.count.toFormat(0)}</span>
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
  mappedEvents,
}: {
  className?: string
  title: string
  label?: string
  mappedEvents: { name: string; ratio: BigNumber; count: BigNumber; color: string }[]
}) {
  return (
    <Indicator title={title} light={true} label={label} className={className}>
      <div className="flex TYPO-BODY-XL !font-bold">
        {mappedEvents.length > 0 && (
          <div className="flex items-center space-x-3">
            <div>
              {mappedEvents[0].name} <span className="FONT-MONO !font-black">{mappedEvents[0].count.toFormat(0)}</span>
            </div>
            <div className="w-3 h-3 rounded-full" style={{ background: mappedEvents[0].color }}></div>
          </div>
        )}
      </div>
    </Indicator>
  )
}

function topBlockEvents(events: BlockEvent[]) {
  if (events.length < 1) return []

  const colors = BLOCK_CHART_COLORS.reverse()

  const sum = events.reduce((accm, event) => accm + event.count, 0)

  return events
    .map((event, i) => {
      return {
        name: event.name,
        count: new BigNumber(event.count),
        ratio: new BigNumber((event.count / sum) * 100),
        color: colors.at(i) ?? colors.at(-1) ?? '#fff',
      }
    })
    .sort((a, b) => b.count.minus(a.count).toNumber())
}

function firstCharToUpperCase(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
