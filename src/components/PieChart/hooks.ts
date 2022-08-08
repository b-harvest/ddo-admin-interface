import BigNumber from 'bignumber.js'
import { CRE_CHART_COLOR_MAP } from 'constants/style'
import { useAtom } from 'jotai'
import { useCallback } from 'react'
import { isDarkModeAtomRef } from 'state/atoms'
import type { PieChartEntry } from 'types/chart'

const usePieChart = () => {
  const getRatioByType = useCallback((item: PieChartEntry, total: number | BigNumber) => {
    const ratio = new BigNumber(item.value).div(total).multipliedBy(100)

    return (ratio.isZero() ? '0' : ratio.lt(1) ? '<1' : ratio.toFormat(0)) + '%'
  }, [])

  const [isDarkModeAtom] = useAtom(isDarkModeAtomRef)
  const getColorMap = useCallback(
    (list: PieChartEntry[]) => {
      const pieColors = isDarkModeAtom ? [...CRE_CHART_COLOR_MAP] : [...CRE_CHART_COLOR_MAP].reverse()
      return list.reduce(
        (accm, item, index) => ({
          ...accm,
          [item.type]: pieColors[index] ?? pieColors.at(-index),
        }),
        {}
      )
    },
    [isDarkModeAtom]
  )

  return { getRatioByType, getColorMap }
}

export default usePieChart
