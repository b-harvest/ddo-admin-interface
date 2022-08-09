import { useDateWideTVLUSD, useDateWideVolUSD } from 'data/useAPI'
import { useCallback, useMemo } from 'react'
import type { TVLUSDByDate, VolUSDByDate } from 'types/accounts'

const useChartData = () => {
  // tvl
  const { data: tvlUSDData, isLoading: tvlUSDDataLoading } = useDateWideTVLUSD()

  const tvlUSDDataTimestamp = useMemo<number | undefined>(
    () => (tvlUSDData?.syncTimestamp ? tvlUSDData.syncTimestamp * 1000 : undefined),
    [tvlUSDData]
  )

  const tvlUSDChartData = useMemo<TVLUSDByDate[]>(() => {
    return (
      tvlUSDData?.data
        .map((item) => {
          return {
            ...item,
            date: new Date(item.date).getTime(),
          }
        })
        .sort((a, b) => a.date - b.date) ?? []
    )
  }, [tvlUSDData])

  const tvlUSDChartDataByPools = useCallback(
    (poolIds: number[]) => {
      return tvlUSDChartData.map((item) => {
        const tvl = item.detail
          .filter((tvlByPool) => poolIds.includes(tvlByPool.pool))
          .reduce((accm, tvlByPool) => accm + tvlByPool.tvl, 0)
        return {
          date: item.date,
          tvl,
          detail: [],
        }
      })
    },
    [tvlUSDChartData]
  )

  // vol
  const { data: volUSDData, isLoading: volUSDDataLoading } = useDateWideVolUSD()

  const volUSDDataTimestamp = useMemo<number | undefined>(
    () => (volUSDData?.syncTimestamp ? volUSDData.syncTimestamp * 1000 : undefined),
    [volUSDData]
  )

  const volUSDChartData = useMemo<VolUSDByDate[]>(() => {
    return (
      volUSDData?.data
        .map((item) => {
          return {
            ...item,
            date: new Date(item.date).getTime(),
          }
        })
        .sort((a, b) => a.date - b.date) ?? []
    )
  }, [volUSDData])

  const volUSDChartDataByPair = useCallback(
    (pairId: number) => {
      return volUSDChartData.map((item) => {
        const vol = item.detail.find((volByPair) => volByPair.pair === pairId)?.usd_vol ?? 0
        return {
          date: item.date,
          vol,
          detail: [],
        }
      })
    },
    [volUSDChartData]
  )

  const getMinDate = useCallback((list: TVLUSDByDate[] | VolUSDByDate[]) => {
    const date = list.at(0)?.date
    return date ? new Date(date) : new Date()
  }, [])

  const getMaxDate = useCallback((list: TVLUSDByDate[] | VolUSDByDate[]) => {
    const date = list.at(-1)?.date
    return date ? new Date(date) : new Date()
  }, [])

  return {
    tvlUSDDataTimestamp,
    tvlUSDChartData,
    tvlUSDChartDataByPools,
    volUSDDataTimestamp,
    volUSDChartData,
    volUSDChartDataByPair,
    getMinDate,
    getMaxDate,
    tvlUSDDataLoading,
    volUSDDataLoading,
  }
}

export default useChartData
