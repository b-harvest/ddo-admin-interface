import useAppSWR from 'data/useAppSWR'
import useInfoSWR from 'data/useInfoSWR'
import { returnGenerator } from 'data/utils'
import type { AirdropClaimRaw, BalanceRaw, LpFarmStakingRaw } from 'types/account'
import type { TestRaw } from 'types/vo/accounts'
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
export function useAllAccounts(interval = 0) {
  const { data, error, mutate }: ResponseViaSWR<TestRaw[]> = useInfoSWR('/accounts/bharvest', { interval })
  console.log('data -> vo -> useAPI -> useAllAccounts')
  console.log(data)
  return returnGenerator({ data, error, mutate })
}

