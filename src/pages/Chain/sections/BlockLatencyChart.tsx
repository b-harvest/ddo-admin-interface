import BigNumber from 'bignumber.js'
import BarChart from 'components/BarChart'
import { INFO } from 'constants/style'
import { useMemo, useState } from 'react'
import type { FlushByBlock } from 'types/block'
import type { GenericChartEntry } from 'types/chart'
import { openExplorerByHeight } from 'utils/browser'

import BlockChartHead from './../components/BlockChartHead'

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

  // flush hover
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

  return (
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
    />
  )
}
