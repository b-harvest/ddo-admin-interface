import useAppSWR from 'data/useAppSWR'
import useInfoSWR from 'data/useInfoSWR'
import { returnGenerator } from 'data/utils'
import type { AirdropClaimRaw, BalanceRaw, LpFarmStakingRaw } from 'types/account'
import type { AccountRankRaw, TVLUSDByDateRaw, VolUSDByDateRaw } from 'types/accounts'
import type { ResponseViaSWR } from 'types/api'
import type { AssetInfo, AssetLiveRaw } from 'types/asset'
import type { BlockEventIndicatorsRaw, BlocksEventsRaw, BlocksFlushRaw } from 'types/block'
import type { ChainInfo, ChainLive } from 'types/chain'
import { LiquidFarmLiveRaw } from 'types/liquidFarm'
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

export function useFetchAllLiquidFarmLive(interval = 0) {
  const { data, error, mutate }: ResponseViaSWR<LiquidFarmLiveRaw[]> = useAppSWR('/liquidfarm/live', { interval })
  return returnGenerator({ data, error, mutate })
}

// account data
export function useBalance({ address }: { address: string }, interval = 0) {
  const { data, error, mutate }: ResponseViaSWR<BalanceRaw> = useAppSWR(`/acc/${address}/balance/all`, {
    interval,
    fetch: address.length > 0,
  })
  return returnGenerator({ data, error, mutate })
}

/** @summary replace the above from v3 */
export function useLpFarmStaking({ address }: { address: string }, interval = 0) {
  const { data, error, mutate }: ResponseViaSWR<LpFarmStakingRaw[]> = useAppSWR(`/acc/${address}/lpfarm/staking`, {
    interval,
    fetch: address.length > 0,
  })
  return returnGenerator({ data, error, mutate })
}

export function useAirdropClaim({ address }: { address: string }, interval = 0) {
  const { data, error, mutate }: ResponseViaSWR<AirdropClaimRaw> = useAppSWR(`/acc/${address}/airdrop/claimed`, {
    interval,
    fetch: address.length > 0,
  })
  return returnGenerator({ data, error, mutate })
}

export function useProposals({ address = 'anonymous' }: { address?: string }, interval = 0) {
  const { data, error, mutate }: ResponseViaSWR<ProposalRaw[]> = useAppSWR(`/acc/${address}/gov`, {
    interval,
    fetch: address.length > 0,
  })
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
  const { data, error, mutate }: ResponseViaSWR<LSVEventRaw[]> = useInfoSWR(`/a1/lsv/event/${address}`, {
    interval,
    fetch: address.length > 0,
  })
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

/** this api will be del since the data is synced every 3 min on server side */
export function useTVLVolUSDUpdate(interval = 0) {
  const { data, error, mutate }: ResponseViaSWR<undefined> = useInfoSWR('/a1/sync', { interval })
  return returnGenerator({ data, error, mutate })
}

/** metric data */
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
