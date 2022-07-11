import BigNumber from 'bignumber.js'
import type { ResponseViaSWR } from 'types/api'

// - balance
// rpc
export interface BalanceRPC {
  readonly denom: string
  readonly amount: string
}

// rpc rest
export interface BalanceLCD {
  readonly balances: BalanceRPC[]
  pagination: { next_key: any; total: string }
}

// backend
export interface Balance {
  readonly address: string
  readonly asset: (BalanceRPC & { reserved: string })[]
  readonly unbonding?: { CompleteTimestamp: number; txhash: string; amount: string; unbondingAmount: string }[] | null
}

export type BalanceRes = ResponseViaSWR<Balance>
export type BalanceLCDRes = ResponseViaSWR<BalanceLCD>

// - farm staked amount
// rpc res
export interface FarmStakedLCDRaw {
  readonly staked_coins: any[]
  readonly queued_coins: any[]
}

// backend
export interface HarvestableStakedRaw {
  rewardDenom: string
  rewardAmount: number
}

export type HarvestableStaked = Omit<HarvestableStakedRaw, 'rewardAmount'> & { rewardAmount: BigNumber }

export interface FarmStakedRaw {
  readonly denom: string
  readonly queuedAmount: string
  readonly stakedAmount: string
  readonly harvestable: HarvestableStakedRaw[]
  readonly unharvest: any[]
}

export type FarmStaked = Omit<FarmStakedRaw, 'queuedAmount' | 'stakedAmount' | 'harvestable'> & {
  readonly queuedAmount: BigNumber
  readonly stakedAmount: BigNumber
  readonly harvestable: HarvestableStaked[]
}

// - farm reward
// rpc res
export interface FarmRewardLCDRaw {
  readonly staking_coin_denom: string
  readonly rewards: {
    denom: string
    amount: string
  }[]
}

export type FarmRewardLCD = Omit<FarmRewardLCDRaw, 'rewards'> & {
  readonly rewards: {
    denom: string
    amount: BigNumber
  }[]
}

export interface FarmRewardsLCDRaw {
  pagination: { next_key: any; total: string }
  readonly rewards: FarmRewardLCDRaw[]
}

export type FarmRewardsLCD = {
  readonly rewards: FarmRewardLCD[]
}
