import BigNumber from 'bignumber.js'
import { useAllLSV } from 'data/useAPI'
import { useMemo } from 'react'
import type { LSV } from 'types/lsv'

const useLSV = () => {
  const { data: allLSVData } = useAllLSV()

  const allLSVTimestamp = useMemo<number | undefined>(
    () => (allLSVData ? allLSVData.curTimestamp * 1000 : undefined),
    [allLSVData]
  )

  const allLSV = useMemo<LSV[]>(
    () =>
      allLSVData?.data.map((item) => {
        const lsvStartTimestamp = item.lsvStartTimestamp * 1000
        const tokens = new BigNumber(item.tokens) // exponent wip
        const commission = Number(item.commission) * 100
        const jailed = item.jailUntilTimestamp !== 0

        return {
          ...item,
          lsvStartTimestamp,
          tokens,
          commission,
          jailed,
          immediateKickout: jailed || commission > 20,
        }
      }) ?? [],
    [allLSVData]
  )

  return { allLSVTimestamp, allLSV }
}

export default useLSV
