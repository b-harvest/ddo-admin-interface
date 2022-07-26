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
  poolType: number
  minPrice: number
  maxPrice: number
  poolPrice: string
  Reserved: { denom: string; amount: string; priceOracle: number }[]
}

export type RewardPerToken = Omit<RewardPerTokenRaw, 'rewardAmount'> & {
  rewardAmount: BigNumber
}

export type PoolLive = Pick<PoolLiveRaw, 'poolId' | 'poolDenom' | 'pairId' | 'poolType' | 'minPrice' | 'maxPrice'> & {
  totalStakedAmount: BigNumber
  totalQueuedAmount: BigNumber
  totalSupplyAmount: BigNumber
  priceOracle: BigNumber
  apr: BigNumber
  RewardsPerToken: RewardPerToken[] | null
  poolPrice: BigNumber
  reserved: { denom: string; amount: BigNumber; priceOracle: BigNumber }[]
}
