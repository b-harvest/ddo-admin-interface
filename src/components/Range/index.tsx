import BigNumber from 'bignumber.js'
import Tooltip from 'components/Tooltip'
import { useMemo } from 'react'

type RangeProps = { min: BigNumber; max: BigNumber; current: BigNumber; dp?: number }

export default function Range({ min, max, current, dp = 6 }: RangeProps) {
  const currentDotPositionPercentage = useMemo<number>(() => {
    const range = max.minus(min)
    const curr = current.minus(min)
    return curr.div(range).toNumber() * 100
  }, [min, max, current])

  return (
    <div className="flex flex-col gap-y-2 justify-center items-stretch w-full h-full">
      <div className="relative w-full h-0 border-t-2 border-glowCRE">
        <div className="absolute left-0 -top-[5px] w-0 h-2 border-l-2 border-glowCRE"></div>
        <div className="absolute -top-[17px] h-min" style={{ left: `${currentDotPositionPercentage}%` }}>
          <Tooltip content={<div className="FONT-MONO">{current.dp(dp, BigNumber.ROUND_DOWN).toFormat()}</div>}>
            <div className={`w-3 h-3 rounded-full border-2 border-white bg-grayCRE-50-o backdrop-blur-[40px]`}></div>
          </Tooltip>
        </div>
        <div className="absolute right-0 -top-[5px] w-0 h-2 border-r-2 border-glowCRE"></div>
      </div>

      <div className="flex justify-between items-center gap-x-2">
        <div>{min.dp(dp, BigNumber.ROUND_DOWN).toFormat()}</div>
        <div>{max.dp(dp, BigNumber.ROUND_DOWN).toFormat()}</div>
      </div>
    </div>
  )
}
