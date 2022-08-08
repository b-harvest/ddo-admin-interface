import BigNumber from 'bignumber.js'
import Card from 'components/Card'
// import ComposedBarChart from 'components/ComposedBarChart'
import ComposedBarChart from 'components/ComposedBarChart/ant'
import Dot from 'components/Dot'
import Indicator from 'components/Indicator'
import LoadingRows from 'components/LoadingRows'
import { CRE_CHART_COLOR_MAP, GLOW_CRE } from 'constants/style'
import { useAtom } from 'jotai'
import { useMemo, useState } from 'react'
import { isDarkModeAtomRef } from 'state/atoms'
import type { EventsByBlock } from 'types/block'
import type { ComposedChartEntry } from 'types/chart'
import { openExplorerByHeight } from 'utils/browser'
import { firstCharToUpperCase } from 'utils/text'

import BlockChartHead from '../components/BlockChartHead'

export default function BlockEventChart({
  eventIndicators,
  chartData,
  isLoading,
}: {
  eventIndicators: string[]
  chartData: EventsByBlock[]
  isLoading: boolean
}) {
  const blockChartList = useMemo<ComposedChartEntry[]>(() => {
    return chartData.reduce((accm: ComposedChartEntry[], item) => {
      const subList = item.events.map((event) => ({ time: item.height, value: event.value, type: event.label }))
      return accm.concat(subList)
    }, [])
  }, [chartData])

  const [isDarkModeAtom] = useAtom(isDarkModeAtomRef)
  const barColors = useMemo<string[]>(
    () => (isDarkModeAtom ? [...CRE_CHART_COLOR_MAP] : [...CRE_CHART_COLOR_MAP].reverse()),
    [isDarkModeAtom]
  )

  const colorMap = useMemo(() => {
    const map =
      eventIndicators.length > 0
        ? eventIndicators
            .map((type, i) => ({ [type]: barColors[i] ?? barColors.at(-1) }))
            .reduce((accm, set) => ({ ...accm, ...set }), {})
        : undefined
    return map
  }, [eventIndicators, barColors])

  // volume total
  const [blockHeightHover, setBlockHeightHover] = useState<number | undefined>()
  const [eventsHover, setEventsHover] = useState<ComposedChartEntry[] | undefined>()

  const blockHeight = useMemo<number>(
    () => blockHeightHover ?? chartData.at(-1)?.height ?? 0,
    [blockHeightHover, chartData]
  )

  const timestamp = useMemo(
    () => chartData.find((item) => item.height === blockHeight)?.timestamp,
    [blockHeight, chartData]
  )

  const allEvents = useMemo<{ label: string; value: number }[]>(() => {
    const events =
      eventsHover?.map((item) => ({ label: item.type, value: item.value })) ?? chartData.at(-1)?.events ?? []
    return events.sort((a, b) => b.value - a.value)
  }, [chartData, eventsHover])

  const topEvent = useMemo(() => {
    return allEvents[0] ?? { label: 'No event', value: 0 }
  }, [allEvents])

  const handleBarClick = (item: ComposedChartEntry | undefined) => {
    if (item) openExplorerByHeight(item.time.toString())
  }

  // if (!colorMap) return <></>
  return (
    <section className="min-w-[50%]">
      <div className="w-full flex flex-col md:flex-row justify-between items-stretch">
        <ComposedBarChart
          isLoading={!colorMap || isLoading}
          className="grow shrink"
          height={220}
          data={blockChartList}
          colorMap={colorMap}
          setLabel={setBlockHeightHover}
          setItems={setEventsHover}
          label={blockHeightHover}
          onClick={handleBarClick}
          topLeft={
            topEvent && (
              <BlockChartHead
                title="Block-wide top event"
                height={blockHeight.toString()}
                timestamp={timestamp}
                value={<TopEvent event={topEvent} colorMap={colorMap} />}
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
          {isLoading ? (
            <LoadingRows rowsCnt={12} />
          ) : (
            <Indicator title="" light={true} className="space-y-4 md:pt-[2rem] overflow-auto">
              {allEvents.map((event, i) => (
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
          )}
        </Card>
      </div>
    </section>
  )
}

function TopEvent({
  event,
  colorMap,
}: {
  event: { label: string; value: number }
  colorMap?: { [x: string]: string }
}) {
  return (
    <div className="flex items-center space-x-3">
      <div>
        {firstCharToUpperCase(event.label)}{' '}
        <span className="FONT-MONO !font-black">{event.value === 0 ? '' : event.value}</span>
      </div>
      <Dot color={colorMap ? colorMap[event.label] : GLOW_CRE} size="md" />
    </div>
  )
}
