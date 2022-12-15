import BigNumber from 'bignumber.js'
import type { PairDetail } from 'types/pair'

interface RewardPerTokenRaw {
  end: number
  start: number
  planId: number
  rewardDenom: string
  rewardAmount: number
}

interface ReservedTokenRaw {
  denom: string
  amount: string
  priceOracle: number
}

export interface PoolLiveRaw {
  poolId: number
  poolDenom: string
  pairId: number
  totalStakedAmount: string
  totalSupplyAmount: string
  priceOracle: number
  apr: number
  RewardsPerToken: RewardPerTokenRaw[] | null
  poolType: number
  minPrice: number
  maxPrice: number
  poolPrice: string
  Reserved: ReservedTokenRaw[]
}

export type RewardPerToken = Omit<RewardPerTokenRaw, 'rewardAmount'> & {
  rewardAmount: BigNumber
}

export type ReservedToken = Pick<ReservedTokenRaw, 'denom'> & {
  amount: BigNumber
  priceOracle: BigNumber
}

export type PoolLive = Pick<PoolLiveRaw, 'poolId' | 'poolDenom' | 'pairId' | 'poolType' | 'apr'> & {
  totalStakedAmount: BigNumber
  totalSupplyAmount: BigNumber
  priceOracle: BigNumber
  minPrice: BigNumber
  maxPrice: BigNumber
  // apr: BigNumber
  RewardsPerToken: RewardPerToken[] | null
  poolPrice: BigNumber
  reserved: ReservedToken[]
}

export interface PoolDetail extends PoolLive {
  pair: PairDetail
  poolReserves: [ReservedToken, ReservedToken]
  xRatio: BigNumber
  yRatio: BigNumber
  tvlUSD: BigNumber
  isRanged: boolean
  bcreUSDRatio: BigNumber
  bcreApr: BigNumber
  farmStakedUSD: BigNumber
  totalSupplyUSD: BigNumber
  farmStakedRate: number
  unfarmedRate: number
  poolTokenExponent: number
}
