import BigNumber from 'bignumber.js'
import { CRE_CHART_COLOR_MAP } from 'constants/style'
import { useCallback } from 'react'
import type { PieChartEntry } from 'types/chart'

const usePieChart = () => {
  const getRatioByType = useCallback((item: PieChartEntry, total: number | BigNumber) => {
    const ratio = new BigNumber(item.value).div(total).multipliedBy(100)

    return (ratio.isZero() ? '0' : ratio.lt(1) ? '<1' : ratio.toFormat(0)) + '%'
  }, [])

  const getColorMap = useCallback(
    (list: PieChartEntry[]) =>
      list.reduce(
        (accm, item, index) => ({
          ...accm,
          [item.type]: CRE_CHART_COLOR_MAP?.[index] ?? CRE_CHART_COLOR_MAP?.at(-index),
        }),
        {}
      ),
    []
  )

  return { getRatioByType, getColorMap }
}

export default usePieChart
