import BigNumber from 'bignumber.js'
import Card from 'components/Card'
// import ComposedBarChart from 'components/ComposedBarChart'
import ComposedBarChart from 'components/ComposedBarChart/ant'
import Dot from 'components/Dot'
import Indicator from 'components/Indicator'
import { CRE_CHART_COLOR_MAP } from 'constants/style'
import { useMemo, useState } from 'react'
import type { EventsByBlock } from 'types/block'
import type { ComposedChartEntry } from 'types/chart'
import { firstCharToUpperCase } from 'utils/text'

import BlockChartHead from '../components/BlockChartHead'

export default function BlockEventChart({
  eventIndicators,
  chartData,
}: {
  eventIndicators: string[]
  chartData: EventsByBlock[]
}) {
  const blockChartList = useMemo<ComposedChartEntry[]>(() => {
    return chartData.reduce((accm: ComposedChartEntry[], item) => {
      const subList = item.events.map((event) => ({ time: item.height, value: event.value, type: event.label }))
      return accm.concat(subList)
    }, [])
  }, [chartData])

  const colorMap = useMemo(() => {
    const map =
      eventIndicators.length > 0
        ? eventIndicators
            .map((type, i) => ({ [type]: CRE_CHART_COLOR_MAP[i] ?? CRE_CHART_COLOR_MAP.at(-1) }))
            .reduce((accm, set) => ({ ...accm, ...set }), {})
        : undefined
    return map
  }, [eventIndicators])

  // volume total
  const [blockHeightHover, setBlockHeightHover] = useState<number | undefined>()

  const timestamp = useMemo(
    () => chartData.find((item) => item.height === (blockHeightHover ?? chartData.at(-1)?.height))?.timestamp,
    [blockHeightHover, chartData]
  )

  const allEventsHover = useMemo(() => {
    return (
      chartData
        .find((item) => item.height === (blockHeightHover ?? chartData.at(-1)?.height ?? 0))
        ?.events.sort((a, b) => b.value - a.value) ?? []
    )
  }, [chartData, blockHeightHover])

  const topEventHover = useMemo(() => {
    return allEventsHover[0] ?? { label: 'No event', value: 0 }
  }, [allEventsHover])

  if (!colorMap) return <></>
  return (
    <section className="min-w-[50%]">
      <div className="w-full flex flex-col md:flex-row justify-between items-stretch">
        <ComposedBarChart
          className="grow shrink"
          height={220}
          data={blockChartList}
          colorMap={colorMap}
          setLabel={setBlockHeightHover}
          label={blockHeightHover}
          topLeft={
            topEventHover && (
              <BlockChartHead
                title="Block-wide top event"
                height={(blockHeightHover ?? chartData.at(-1)?.height)?.toString()}
                timestamp={timestamp}
                value={<TopEvent event={topEventHover} colorMap={colorMap} />}
              />
            )
          }
          cardMerged="right-bottom"
        />

        <Card
          useGlassEffect={true}
          className="grow-0 shrink-0 w-[100%] md:w-[25%]"
          merged="left-top"
          // style={{ maxHeight: '420px' }}
        >
          <Indicator title="" light={true} className="space-y-4 md:pt-[2rem] overflow-auto">
            {allEventsHover.map((event, i) => (
              <div key={event.label} className="flex items-center space-x-4">
                {colorMap && <Dot color={colorMap[event.label]} />}
                <div className="flex items-center space-x-4 TYPO-BODY-XS md:TYPO-BODY-S">
                  {/* <span>{firstCharToUpperCase(event.label)}</span> */}
                  <span>{event.label}</span>
                  <span className="FONT-MONO !font-bold">{new BigNumber(event.value).toFormat(0)}</span>
                </div>
              </div>
            ))}
          </Indicator>
        </Card>
      </div>
    </section>
  )
}

function TopEvent({ event, colorMap }: { event: { label: string; value: number }; colorMap: { [x: string]: string } }) {
  return (
    <div className="flex items-center space-x-3">
      <div>
        {firstCharToUpperCase(event.label)}{' '}
        <span className="FONT-MONO !font-black">{event.value === 0 ? '' : event.value}</span>
      </div>
      <Dot color={colorMap[event.label]} size="md" />
    </div>
  )
}
