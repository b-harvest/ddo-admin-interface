import useAppSWR from 'data/useAppSWR'
import useInfoSWR from 'data/useInfoSWR'
import { returnGenerator } from 'data/utils'
import type { AirdropClaimRaw, BalanceRaw, LpFarmStakingRaw } from 'types/account'
import type { TestRaw } from 'types/vo/accounts'
import type { BalancesListRaw } from 'types/vo/balances'
import type { TxsListRaw } from 'types/vo/txs'
import type { ValidatorListRaw } from 'types/vo/validators'
import type { VotesListRaw } from 'types/vo/votes'
import type { ProposalsListRaw } from 'types/vo/proposals'
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

// 밸런스 리스트 from balance_per_account
export function useAllBalancesList(interval = 0) {
  const { data, error, mutate }: ResponseViaSWR<BalancesListRaw[]> = useInfoSWR('/balances', { interval })
  console.log('data -> vo -> useAPI -> useAllBalancesList')
  console.log(data)
  return returnGenerator({ data, error, mutate })
}

export function useAllTxsList(interval = 0) {
  const { data, error, mutate }: ResponseViaSWR<TxsListRaw[]> = useInfoSWR('/txs', { interval })
  return returnGenerator({ data, error, mutate })
}

export function useAllValidatorList(interval = 0) {
  const { data, error, mutate }: ResponseViaSWR<ValidatorListRaw[]> = useInfoSWR('/validators', { interval })
  return returnGenerator({ data, error, mutate })
}

export function apiGetVotes(interval = 0) {
  const { data, error, mutate }: ResponseViaSWR<VotesListRaw[]> = useInfoSWR('/votes', { interval })
  return returnGenerator({ data, error, mutate })
}

export function apiGetProposals(interval = 0) {
  const { data, error, mutate }: ResponseViaSWR<ProposalsListRaw[]> = useInfoSWR('/proposals', { interval })
  return returnGenerator({ data, error, mutate })
}

