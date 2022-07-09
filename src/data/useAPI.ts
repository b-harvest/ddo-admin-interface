import useAppSWR, { returnGenerator } from 'data/useAppSWR'
import type { Balance, StakedRaw } from 'types/account'
import type { ResponseViaSWR } from 'types/api'
import type { AssetInfo, AssetLiveRaw } from 'types/asset'
import type { ChainInfo, ChainLive } from 'types/chain'
import type { PairInfoRaw, PairLiveRaw } from 'types/pair'
import type { PoolLiveRaw } from 'types/pool'

// hooks - backend
export function useAllChainInfo(interval = 0) {
  const { data, error }: ResponseViaSWR<ChainInfo[]> = useAppSWR('/chain/info', { interval })
  return returnGenerator({ data, error })
}

export function useAllChainLive(interval = 0) {
  const { data, error }: ResponseViaSWR<ChainLive[]> = useAppSWR('/chain/live', { interval })
  return returnGenerator({ data, error })
}

export function useAllAssetInfo(interval = 0) {
  const { data, error }: ResponseViaSWR<AssetInfo[]> = useAppSWR('/asset/info', { interval })
  return returnGenerator({ data, error })
}

export function useAllAssetLive(interval = 0) {
  const { data, error }: ResponseViaSWR<AssetLiveRaw[]> = useAppSWR('/asset/live', { interval })
  return returnGenerator({ data, error })
}

export function useAllPairInfo(interval = 0) {
  const { data, error }: ResponseViaSWR<PairInfoRaw[]> = useAppSWR('/pair/info', { interval })
  return returnGenerator({ data, error })
}

export function useAllPairLive(interval = 0) {
  const { data, error }: ResponseViaSWR<PairLiveRaw[]> = useAppSWR('/pair/live', { interval })
  return returnGenerator({ data, error })
}

export function useAllPoolLive(interval = 0) {
  const { data, error }: ResponseViaSWR<PoolLiveRaw[]> = useAppSWR('/pool/live', { interval })
  return returnGenerator({ data, error })
}

// account data
export function useAllBalance({ address, fetch = true }: { address: string; fetch?: boolean }, interval = 0) {
  const { data, error }: ResponseViaSWR<Balance> = useAppSWR(`/acc/${address}/balance/all`, { interval, fetch })
  return returnGenerator({ data, error })
}

export function useAllStaked({ address, fetch = true }: { address: string; fetch?: boolean }, interval = 0) {
  const { data, error }: ResponseViaSWR<StakedRaw[]> = useAppSWR(`/acc/${address}/farm/staking`, {
    interval,
    fetch,
  })
  return returnGenerator({ data, error })
}
