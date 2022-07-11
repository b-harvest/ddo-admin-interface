import useAppSWR, { lcdReturnGenerator } from 'data/useAppSWR'
import type { BalanceLCD } from 'types/account'
import type { LCDResponseViaSWR } from 'types/api'
import type { BlockLCD } from 'types/block'

// hooks - rpc rest
export function useAllBalanceLCD(address: string, interval = 0) {
  const { data, error }: LCDResponseViaSWR<BalanceLCD> = useAppSWR(
    `/cosmos/bank/v1beta1/balances/${address}`,
    interval,
    'rpc-rest'
  )
  return lcdReturnGenerator({ data, error })
}

export function useLatestBlockLCD(interval = 0) {
  const { data, error }: LCDResponseViaSWR<BlockLCD> = useAppSWR(`/blocks/latest`, interval, 'rpc-rest')
  return lcdReturnGenerator({ data, error })
}
