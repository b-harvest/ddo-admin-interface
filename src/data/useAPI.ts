import useAppSWR, { returnGenerator } from 'data/useAppSWR'
import useInfoSWR from 'data/useInfoSWR'
import type { AirdropClaimRaw, BalanceRaw, StakedRaw } from 'types/account'
import type { AccountRankRaw, TVLUSDByDateRaw, VolUSDByDateRaw } from 'types/accounts'
import type { ResponseViaSWR } from 'types/api'
import type { AssetInfo, AssetLiveRaw } from 'types/asset'
import type { BlockEventIndicatorsRaw, BlocksEventsRaw, BlocksFlushRaw } from 'types/block'
import type { ChainInfo, ChainLive } from 'types/chain'
import type { LiquidStakeRaw } from 'types/liquidStake'
import type { LSVRaw, LSVVoteRaw } from 'types/lsv'
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
export function useAllLSV(interval = 0) {
  const { data, error }: ResponseViaSWR<LSVRaw[]> = useInfoSWR('/a1/lsv', { interval })
  return returnGenerator({ data, error })
}

export function useAllLSVVote(interval = 0) {
  const { data, error }: ResponseViaSWR<LSVVoteRaw[]> = useInfoSWR('/a1/lsv/vote', { interval })
  return returnGenerator({ data, error })
}

export function useAllAccountsRank(interval = 0) {
  const { data, error }: ResponseViaSWR<AccountRankRaw[]> = useInfoSWR('/a1/rank', { interval })
  return returnGenerator({ data, error })
}

export function useDateWideTVLUSD(interval = 0) {
  const { data, error }: ResponseViaSWR<TVLUSDByDateRaw[]> = useInfoSWR('/a1/tvl', { interval })
  return returnGenerator({ data, error })
}

export function useDateWideVolUSD(interval = 0) {
  const { data, error }: ResponseViaSWR<VolUSDByDateRaw[]> = useInfoSWR('/a1/vol', { interval })
  return returnGenerator({ data, error })
}

export function useTVLVolUSDUpdate(interval = 0) {
  const { data, error }: ResponseViaSWR<undefined> = useInfoSWR('/a1/sync', { interval })
  return returnGenerator({ data, error })
}

// metric
export function useAllBlocksFlush(interval = 0) {
  const { data, error }: ResponseViaSWR<BlocksFlushRaw[]> = useInfoSWR('/a1/metric/flush_ts_diff_nano', { interval })
  return returnGenerator({ data, error })
}

export function useAllBlocksEvents(interval = 0) {
  const { data, error }: ResponseViaSWR<BlocksEventsRaw[]> = useInfoSWR('/a1/metric/event_row_count', { interval })
  return returnGenerator({ data, error })
}

export function useBlockEventIndicators(interval = 0) {
  const { data, error }: ResponseViaSWR<BlockEventIndicatorsRaw[]> = useInfoSWR(
    '/a1/metric/event_row_count/indicator',
    {
      interval,
    }
  )
  return returnGenerator({ data, error })
}
