import useAppSWR, { returnGenerator } from 'data/useAppSWR'
import type { Balance } from 'types/account'
import type { ResponseViaSWR } from 'types/api'

// hooks - rpc rest
// tmp - cosmos rpc url things will be removed
export function useAllBalanceRPC(address: string, interval = 0) {
  const DUMMY_ADDRESS = 'cosmos1le890ld7v2hfsaq7cz5ws8zsdnpmhlysl254u4'
  const { data, error }: ResponseViaSWR<Balance> = useAppSWR(
    `/cosmos/bank/v1beta1/balances/${DUMMY_ADDRESS}`,
    interval,
    'rpc-rest'
  )
  return returnGenerator({ data, error })
}
