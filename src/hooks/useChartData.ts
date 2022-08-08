import { useDateWideTVLUSD, useDateWideVolUSD } from 'data/useAPI'
import { useCallback, useMemo } from 'react'
import type { TVLUSDByDate, VolUSDByDate } from 'types/accounts'

const useChartData = () => {
  // tvl
  const { data: tvlUSDData, isLoading: tvlUSDDataLoading } = useDateWideTVLUSD()

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

  // vol
  const { data: volUSDData, isLoading: volUSDDataLoading } = useDateWideVolUSD()

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

  const getMinDate = useCallback((list: TVLUSDByDate[] | VolUSDByDate[]) => {
    const date = list.at(0)?.date
    return date ? new Date(date) : new Date()
  }, [])

  const getMaxDate = useCallback((list: TVLUSDByDate[] | VolUSDByDate[]) => {
    const date = list.at(-1)?.date
    return date ? new Date(date) : new Date()
  }, [])

  return { tvlUSDChartData, volUSDChartData, getMinDate, getMaxDate, tvlUSDDataLoading, volUSDDataLoading }
}

export default useChartData
