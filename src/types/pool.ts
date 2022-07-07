import BigNumber from 'bignumber.js'

interface RewardPerTokenRaw {
  end: number
  start: number
  planId: number
  rewardDenom: string
  rewardAmount: number
}

export interface PoolLiveRaw {
  poolId: number
  poolDenom: string
  pairId: number
  totalStakedAmount: string
  totalQueuedAmount: string
  totalSupplyAmount: string
  priceOracle: number
  apr: number
  RewardsPerToken: RewardPerTokenRaw[] | null
}

export type RewardPerToken = Omit<RewardPerTokenRaw, 'rewardAmount'> & {
  rewardAmount: BigNumber
}

export type PoolLive = Pick<PoolLiveRaw, 'poolId' | 'poolDenom' | 'pairId'> & {
  totalStakedAmount: BigNumber
  totalQueuedAmount: BigNumber
  totalSupplyAmount: BigNumber
  priceOracle: BigNumber
  apr: BigNumber
  RewardsPerToken: RewardPerToken[] | null
}
