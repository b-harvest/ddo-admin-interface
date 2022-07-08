import useAppSWR, { lcdReturnGenerator } from 'data/useAppSWR'
import type { BalanceLCD, FarmRewardsLCDRaw } from 'types/account'
import type { LCDResponseViaSWR } from 'types/api'
import type { BlockLCD } from 'types/block'

// hooks - rpc rest
export function useAllBalanceLCD({ address, fetch = true }: { address: string; fetch?: boolean }, interval = 0) {
  const { data, error }: LCDResponseViaSWR<BalanceLCD> = useAppSWR(`/cosmos/bank/v1beta1/balances/${address}`, {
    interval,
    type: 'rpc-rest',
    fetch,
  })
  return lcdReturnGenerator({ data, error })
}

export function useAllFarmRewardsLCD({ address, fetch = true }: { address: string; fetch?: boolean }, interval = 0) {
  const { data, error }: LCDResponseViaSWR<FarmRewardsLCDRaw> = useAppSWR(
    `/crescent/farming/v1beta1/rewards/${address}`,
    {
      interval,
      type: 'rpc-rest',
      fetch,
    }
  )
  return lcdReturnGenerator({ data, error })
}

// export function useAllFarmStakedLCD({ address, fetch = true }: { address: string; fetch?: boolean }, interval = 0) {
//   const { data, error }: LCDResponseViaSWR<FarmRewardsLCDRaw> = useAppSWR(
//     `/crescent/farming/v1beta1/stakings/${address}`,
//     {
//       interval,
//       type: 'rpc-rest',
//       fetch,
//     }
//   )
//   return lcdReturnGenerator({ data, error })
// }

export function useLatestBlockLCD({ fetch = true }: { fetch?: boolean }, interval = 0) {
  const { data, error }: LCDResponseViaSWR<BlockLCD> = useAppSWR(`/blocks/latest`, {
    interval,
    type: 'rpc-rest',
    fetch,
  })
  return lcdReturnGenerator({ data, error })
}
