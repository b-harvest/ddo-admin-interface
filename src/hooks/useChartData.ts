import { useDateWideTVLUSD, useDateWideVolUSD } from 'data/useAPI'
import { useMemo } from 'react'
import type { TVLUSDByDate, VolUSDByDate } from 'types/accounts'

const useChartData = () => {
  // tvl
  const { data: tvlUSDData } = useDateWideTVLUSD()

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
  const { data: volUSDData } = useDateWideVolUSD()

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

  return { tvlUSDChartData, volUSDChartData }
}

export default useChartData
