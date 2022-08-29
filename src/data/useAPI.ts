import useAppSWR, { returnGenerator } from 'data/useAppSWR'
import useInfoSWR from 'data/useInfoSWR'
import type { AirdropClaimRaw, BalanceRaw, StakedRaw } from 'types/account'
import type { AccountRankRaw, TVLUSDByDateRaw, VolUSDByDateRaw } from 'types/accounts'
import type { ResponseViaSWR } from 'types/api'
import type { AssetInfo, AssetLiveRaw } from 'types/asset'
import type { BlockEventIndicatorsRaw, BlocksEventsRaw, BlocksFlushRaw } from 'types/block'
import type { ChainInfo, ChainLive } from 'types/chain'
import type { LiquidStakeRaw } from 'types/liquidStake'
import type { LSVEventRaw, LSVRaw, LSVVoteRaw } from 'types/lsv'
import type { PairInfoRaw, PairLiveRaw } from 'types/pair'
import type { PoolLiveRaw } from 'types/pool'
import type { ProposalRaw } from 'types/proposal'

// hooks
export function useAllChainInfo(interval = 0) {
  const { data, error, mutate }: ResponseViaSWR<ChainInfo[]> = useAppSWR('/chain/info', { interval })
  return returnGenerator({ data, error, mutate })
}

export function useAllChainLive(interval = 0) {
  const { data, error, mutate }: ResponseViaSWR<ChainLive[]> = useAppSWR('/chain/live', { interval })
  return returnGenerator({ data, error, mutate })
}

export function useAllAssetInfo(interval = 0) {
  const { data, error, mutate }: ResponseViaSWR<AssetInfo[]> = useAppSWR('/asset/info', { interval })
  return returnGenerator({ data, error, mutate })
}

export function useAllAssetLive(interval = 0) {
  const { data, error, mutate }: ResponseViaSWR<AssetLiveRaw[]> = useAppSWR('/asset/live', { interval })
  return returnGenerator({ data, error, mutate })
}

export function useAllPairInfo(interval = 0) {
  const { data, error, mutate }: ResponseViaSWR<PairInfoRaw[]> = useAppSWR('/pair/info', { interval })
  return returnGenerator({ data, error, mutate })
}

export function useAllPairLive(interval = 0) {
  const { data, error, mutate }: ResponseViaSWR<PairLiveRaw[]> = useAppSWR('/pair/live', { interval })
  return returnGenerator({ data, error, mutate })
}

export function useAllPoolLive(interval = 0) {
  const { data, error, mutate }: ResponseViaSWR<PoolLiveRaw[]> = useAppSWR('/pool/live', { interval })
  return returnGenerator({ data, error, mutate })
}

export function useAllStakeLive(interval = 0) {
  const { data, error, mutate }: ResponseViaSWR<LiquidStakeRaw> = useAppSWR('/stake/live', { interval })
  return returnGenerator({ data, error, mutate })
}

// account data
export function useBalance({ address, fetch = true }: { address: string; fetch?: boolean }, interval = 0) {
  const { data, error, mutate }: ResponseViaSWR<BalanceRaw> = useAppSWR(`/acc/${address}/balance/all`, {
    interval,
    fetch,
  })
  return returnGenerator({ data, error, mutate })
}

export function useFarmStaked({ address, fetch = true }: { address: string; fetch?: boolean }, interval = 0) {
  const { data, error, mutate }: ResponseViaSWR<StakedRaw[]> = useAppSWR(`/acc/${address}/farm/staking`, {
    interval,
    fetch,
  })
  return returnGenerator({ data, error, mutate })
}

export function useAirdropClaim({ address, fetch = true }: { address: string; fetch?: boolean }, interval = 0) {
  const { data, error, mutate }: ResponseViaSWR<AirdropClaimRaw> = useAppSWR(`/acc/${address}/airdrop/claimed`, {
    interval,
    fetch,
  })
  return returnGenerator({ data, error, mutate })
}

export function useProposals({ address = 'anonymous' }: { address?: string }, interval = 0) {
  const { data, error, mutate }: ResponseViaSWR<ProposalRaw[]> = useAppSWR(`/acc/${address}/gov`, { interval })
  return returnGenerator({ data, error, mutate })
}

// info
export function useAllLSV(interval = 0) {
  const { data, error, mutate }: ResponseViaSWR<LSVRaw[]> = useInfoSWR('/a1/lsv', { interval })
  return returnGenerator({ data, error, mutate })
}

export function useAllLSVVote(interval = 0) {
  const { data, error, mutate }: ResponseViaSWR<LSVVoteRaw[]> = useInfoSWR('/a1/lsv/vote', { interval })
  return returnGenerator({ data, error, mutate })
}

export function usePenaltiesByLSV({ address }: { address: string }, interval = 0) {
  const { data, error, mutate }: ResponseViaSWR<LSVEventRaw[]> = useInfoSWR(`/a1/lsv/event/${address}`, { interval })
  return returnGenerator({ data, error, mutate })
}

export function useAllAccountsRank(interval = 0) {
  const { data, error, mutate }: ResponseViaSWR<AccountRankRaw[]> = useInfoSWR('/a1/rank', { interval })
  return returnGenerator({ data, error, mutate })
}

export function useDateWideTVLUSD(interval = 0) {
  const { data, error, mutate }: ResponseViaSWR<TVLUSDByDateRaw[]> = useInfoSWR('/a1/tvl', { interval })
  return returnGenerator({ data, error, mutate })
}

export function useDateWideVolUSD(interval = 0) {
  const { data, error, mutate }: ResponseViaSWR<VolUSDByDateRaw[]> = useInfoSWR('/a1/vol', { interval })
  return returnGenerator({ data, error, mutate })
}

export function useTVLVolUSDUpdate(interval = 0) {
  const { data, error, mutate }: ResponseViaSWR<undefined> = useInfoSWR('/a1/sync', { interval })
  return returnGenerator({ data, error, mutate })
}

// metric
export function useAllBlocksFlush(interval = 0) {
  const { data, error, mutate }: ResponseViaSWR<BlocksFlushRaw[]> = useInfoSWR('/a1/metric/flush_ts_diff_nano', {
    interval,
  })
  return returnGenerator({ data, error, mutate })
}

export function useAllBlocksEvents(interval = 0) {
  const { data, error, mutate }: ResponseViaSWR<BlocksEventsRaw[]> = useInfoSWR('/a1/metric/event_row_count', {
    interval,
  })
  return returnGenerator({ data, error, mutate })
}

export function useBlockEventIndicators(interval = 0) {
  const { data, error, mutate }: ResponseViaSWR<BlockEventIndicatorsRaw[]> = useInfoSWR(
    '/a1/metric/event_row_count/indicator',
    {
      interval,
    }
  )
  return returnGenerator({ data, error, mutate })
}
