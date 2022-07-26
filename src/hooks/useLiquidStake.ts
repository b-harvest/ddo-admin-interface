import BigNumber from 'bignumber.js'
import { useAllStakeLive } from 'data/useAPI'
import { useMemo } from 'react'

const useLiquidStake = () => {
  const { data } = useAllStakeLive()

  const liquidStakeAPR = useMemo(
    () => (data ? new BigNumber(data.data.apr).dividedBy(2).decimalPlaces(2).toNumber() : 0),
    [data]
  )
  const bcreMintRatio = useMemo(() => data?.data.mintRatio ?? 0, [data])

  return { liquidStakeAPR, bcreMintRatio }
}

export default useLiquidStake
