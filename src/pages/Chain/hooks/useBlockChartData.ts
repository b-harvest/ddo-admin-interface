import { useAllBlocksEvents, useAllBlocksFlush, useBlockEventIndicators } from 'data/useAPI'
import { useMemo } from 'react'
import type { EventsByBlock, FlushByBlock } from 'types/block'

const useBlockChartData = () => {
  // block events
  const { data: blockEventIndicatorsData, isLoading: blockEventIndicatorsDataLoading } = useBlockEventIndicators()
  const { data: blockEventCountsData, isLoading: blockEventCountsDataLoading } = useAllBlocksEvents()

  const blockEventDataLoading = useMemo<boolean>(
    () => blockEventIndicatorsDataLoading || blockEventCountsDataLoading,
    [blockEventIndicatorsDataLoading, blockEventCountsDataLoading]
  )

  const eventIndicators = useMemo<string[]>(() => {
    const indicatorsData = blockEventIndicatorsData?.data.length ? blockEventIndicatorsData.data[0] : undefined
    return indicatorsData?.indicator ?? []
  }, [blockEventIndicatorsData])

  const blockEventChartData = useMemo<EventsByBlock[]>(() => {
    const countsData = blockEventCountsData?.data.length ? blockEventCountsData.data[0] : undefined

    if (!eventIndicators.length || !countsData) return [] // length check needed (wip)

    return countsData.rows
      .map((item) => {
        const counts = item.var_str.split(',')
        const events = counts
          .map((count, index) => ({ value: Number(count), label: eventIndicators[index] ?? '-' }))
          .filter((item) => item.value && item.value > 0)

        return {
          height: item.height,
          timestamp_nano: item.timestamp_nano,
          timestamp: item.timestamp_nano / 1000000,
          events,
        }
      })
      .reverse()
    // .sort((a, b) => a.height - b.height)
  }, [eventIndicators, blockEventCountsData])

  // block flush records
  const { data: blocksFlushData, isLoading: blocksFlushDataLoading } = useAllBlocksFlush()

  const blockFlushChartData = useMemo<FlushByBlock[]>(() => {
    const flushData = blocksFlushData?.data.length ? blocksFlushData.data[0] : undefined

    return (
      flushData?.rows
        .map((item) => {
          return {
            height: item.height,
            timestamp_nano: item.timestamp_nano,
            timestamp: item.timestamp_nano / 1000000,
            flush: item.var_int, // ms
          }
        })
        .reverse() ??
      // .sort((a, b) => a.height - b.height)
      []
    )
  }, [blocksFlushData])

  return { eventIndicators, blockEventChartData, blockFlushChartData, blockEventDataLoading, blocksFlushDataLoading }
}

export default useBlockChartData
