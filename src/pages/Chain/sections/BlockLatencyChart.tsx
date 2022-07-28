import BigNumber from 'bignumber.js'
import BarChart from 'components/BarChart'
import { INFO } from 'constants/style'
import { useMemo, useState } from 'react'
import type { FlushByBlock } from 'types/block'
import type { GenericChartEntry } from 'types/chart'

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
    return new BigNumber(flushHover ?? blockFlushChartList.at(-1)?.value ?? 0).toFormat(0)
  }, [flushHover, blockFlushChartList])

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
