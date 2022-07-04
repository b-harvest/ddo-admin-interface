import useAppSWR, { returnGenerator } from 'data/useAppSWR'
import type { Balance } from 'types/account'
import type { ResponseViaSWR } from 'types/api'
import type { AssetInfo, AssetLive } from 'types/asset'
import type { PairInfo, PairLive } from 'types/pair'

// hooks - backend
export function useAllAssetInfo(interval = 0) {
  const { data, error }: ResponseViaSWR<AssetInfo[]> = useAppSWR('/asset/info', interval)
  return returnGenerator({ data, error })
}

export function useAllAssetLive(interval = 0) {
  const { data, error }: ResponseViaSWR<AssetLive[]> = useAppSWR('/asset/live', interval)
  return returnGenerator({ data, error })
}

export function useAllPairInfo(interval = 0) {
  const { data, error }: ResponseViaSWR<PairInfo[]> = useAppSWR('/pair/info', interval)
  return returnGenerator({ data, error })
}

export function useAllPairLive(interval = 0) {
  const { data, error }: ResponseViaSWR<PairLive[]> = useAppSWR('/pair/live', interval)
  return returnGenerator({ data, error })
}

export function useAllBalance(address: string, interval = 0) {
  const { data, error }: ResponseViaSWR<Balance> = useAppSWR(`/acc/${address}/balance/all`, interval)
  return returnGenerator({ data, error })
}
