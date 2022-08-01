import BigNumber from 'bignumber.js'
import BarChart from 'components/BarChart'
import Card from 'components/Card'
import Indicator from 'components/Indicator'
import Toggler from 'components/Toggler'
import { INFO } from 'constants/style'
import { useMemo, useState } from 'react'
import type { FlushByBlock } from 'types/block'
import type { GenericChartEntry } from 'types/chart'
import { openExplorerByHeight } from 'utils/browser'

import BlockChartHead from './../components/BlockChartHead'

enum BLOCK_INTERVAL {
  Ten = 10,
  Twenty = 20,
  Thirty = 30,
  Hundreds = 100,
}
const BLOCK_FLUSH_TIME_AVG_PERIOD_TAB_ITEMS = [
  {
    label: '10',
    value: BLOCK_INTERVAL.Ten,
  },
  {
    label: '20',
    value: BLOCK_INTERVAL.Twenty,
  },
  {
    label: '30',
    value: BLOCK_INTERVAL.Thirty,
  },
  {
    label: '100',
    value: BLOCK_INTERVAL.Hundreds,
  },
]

export default function BlockLatencyChart({ chartData }: { chartData: FlushByBlock[] }) {
  // chartData
  const blockFlushChartList = useMemo<GenericChartEntry[]>(() => {
    return chartData.map((item) => {
      return {
        time: item.height,
        value: item.flush,
      }
    })
  }, [chartData])

  // chart flush hover
  const [flushHover, setFlushHover] = useState<number | undefined>()
  const [flushHeightHover, setFlushHeightHover] = useState<string | undefined>()

  const timestamp = useMemo(
    () =>
      flushHeightHover
        ? chartData.find((item) => item.height === Number(flushHeightHover))?.timestamp
        : chartData.at(-1)?.timestamp,
    [flushHeightHover, chartData]
  )
  const flushChartHead = useMemo(() => {
    const flush = flushHover ?? blockFlushChartList.at(-1)?.value

    return flush !== undefined ? new BigNumber(flush).toFormat(0) + ' ns' : '-'
  }, [flushHover, blockFlushChartList])

  const handleBarClick = (time: number | undefined) => {
    if (time) openExplorerByHeight(time.toString())
  }

  // avg interval
  const [avgInterval, setAvgInterval] = useState<BLOCK_INTERVAL>(BLOCK_INTERVAL.Ten)
  const avgFlushTime = useMemo<string>(
    () =>
      new BigNumber(blockFlushChartList.slice(-avgInterval).reduce((accm, item) => accm + item.value, 0))
        .div(avgInterval)
        .toFormat(0),
    [blockFlushChartList, avgInterval]
  )

  return (
    <div className="w-full flex flex-col md:flex-row justify-between items-stretch">
      <BarChart
        height={220}
        minHeight={360}
        data={blockFlushChartList}
        color={INFO}
        setValue={setFlushHover}
        setLabel={setFlushHeightHover}
        value={flushHover}
        label={flushHeightHover}
        onClick={handleBarClick}
        topLeft={
          <BlockChartHead
            title="Block flushing time"
            height={flushHeightHover ?? blockFlushChartList.at(-1)?.time.toString()}
            timestamp={timestamp}
            value={flushChartHead}
          />
        }
        cardMerged="right-bottom"
      />

      <Card
        useGlassEffect={true}
        className="grow-0 shrink-0 w-[100%] md:w-[25%]"
        merged="left-top"
        // style={{ maxHeight: '420px' }}
      >
        <Indicator title="" light={true} className="space-y-4 overflow-auto">
          <div className="w-full flex flex-col items-start space-y-2 TYPO-BODY-M !font-medium">
            <div>
              <div className="text-grayCRE-300 dark:text-grayCRE-400 mb-2 mr-2">{avgInterval}-block-avg.</div>
              <div className="TYPO-BODY-L !font-bold">{avgFlushTime} ns</div>
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Toggler<BLOCK_INTERVAL>
                tabItems={BLOCK_FLUSH_TIME_AVG_PERIOD_TAB_ITEMS}
                selectedValue={avgInterval}
                onChange={setAvgInterval}
              />
            </div>
          </div>
        </Indicator>
      </Card>
    </div>
  )
}
