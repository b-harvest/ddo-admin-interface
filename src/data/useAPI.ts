import useAppSWR, { returnGenerator } from 'data/useAppSWR'
import useInfoSWR from 'data/useInfoSWR'
import type { AirdropClaimRaw, BalanceRaw, StakedRaw } from 'types/account'
import type { ResponseViaSWR } from 'types/api'
import type { AssetInfo, AssetLiveRaw } from 'types/asset'
import type { ChainInfo, ChainLive } from 'types/chain'
import type { LiquidStakeRaw } from 'types/liquidStake'
import type { PairInfoRaw, PairLiveRaw } from 'types/pair'
import type { PoolLiveRaw } from 'types/pool'

// hooks
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

export function useAllStakeLive(interval = 0) {
  const { data, error }: ResponseViaSWR<LiquidStakeRaw> = useAppSWR('/stake/live', { interval })
  return returnGenerator({ data, error })
}

// account data
export function useBalance({ address, fetch = true }: { address: string; fetch?: boolean }, interval = 0) {
  const { data, error }: ResponseViaSWR<BalanceRaw> = useAppSWR(`/acc/${address}/balance/all`, { interval, fetch })
  return returnGenerator({ data, error })
}

export function useFarmStaked({ address, fetch = true }: { address: string; fetch?: boolean }, interval = 0) {
  const { data, error }: ResponseViaSWR<StakedRaw[]> = useAppSWR(`/acc/${address}/farm/staking`, {
    interval,
    fetch,
  })
  return returnGenerator({ data, error })
}

export function useAirdropClaim({ address, fetch = true }: { address: string; fetch?: boolean }, interval = 0) {
  const { data, error }: ResponseViaSWR<AirdropClaimRaw> = useAppSWR(`/acc/${address}/airdrop/claimed`, {
    interval,
    fetch,
  })
  return returnGenerator({ data, error })
}

// info
export function useAllAccountBalance(interval = 0) {
  const { data, error }: ResponseViaSWR<LiquidStakeRaw> = useInfoSWR('/a1/rank', { interval })
  return returnGenerator({ data, error })
}
