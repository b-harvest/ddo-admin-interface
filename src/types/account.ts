import BigNumber from 'bignumber.js'

// * common subset for LCD response
export interface LCDTokenAmountSetRaw {
  readonly denom: string
  readonly amount: string
}

export type LCDTokenAmountSet = Omit<LCDTokenAmountSetRaw, 'amount'> & {
  readonly amount: BigNumber
}

// * balance
// rpc
export type BalanceRPC = LCDTokenAmountSetRaw

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

// * staked
// mainnet rpc
export interface StakedLCDMainnetRaw {
  staked_coins: LCDTokenAmountSetRaw[]
  queued_coins: LCDTokenAmountSetRaw[]
}

export type StakedLCDMainnet = {
  staked_coins: LCDTokenAmountSet[]
  queued_coins: LCDTokenAmountSet[]
}

// testnet rpc
interface StakedByPoolLCDRaw {
  readonly staking_coin_denom: string
  readonly amount: string
  readonly starting_epoch?: string
}

export type StakedByPoolLCD = Omit<StakedByPoolLCDRaw, 'staking_coin_denom' | 'amount'> & {
  readonly denom: string
  readonly amount: BigNumber
}

export interface StakedLCDRaw {
  readonly stakings: StakedByPoolLCDRaw[]
  pagination: { next_key: any; total: string }
}

export type StakedLCD = { readonly stakings: StakedByPoolLCD[] }

// backend
export interface HarvestableStakedRaw {
  rewardDenom: string
  rewardAmount: number
}

export type HarvestableStaked = Omit<HarvestableStakedRaw, 'rewardAmount'> & { rewardAmount: BigNumber }

export interface StakedRaw {
  readonly denom: string
  readonly queuedAmount: string
  readonly stakedAmount: string
  readonly harvestable: HarvestableStakedRaw[]
  readonly unharvest: any[]
}

export type Staked = Omit<StakedRaw, 'queuedAmount' | 'stakedAmount' | 'harvestable'> & {
  readonly queuedAmount: BigNumber
  readonly stakedAmount: BigNumber
  readonly harvestable: HarvestableStaked[]
}

// * farm position
export interface FarmPositionLCDRaw {
  readonly staked_coins: LCDTokenAmountSetRaw[]
  readonly queued_coins: LCDTokenAmountSetRaw[]
  readonly rewards: LCDTokenAmountSetRaw[]
}

// * farm reward
// mainnet rpc
export interface FarmRewardLCDMainnetRaw {
  readonly rewards: LCDTokenAmountSetRaw[]
}
export type FarmRewardLCDMainnet = Omit<FarmRewardLCDMainnetRaw, 'rewards'> & {
  readonly rewards: LCDTokenAmountSet[]
}

// testnet rpc
export interface FarmRewardLCDRaw {
  readonly staking_coin_denom: string
  readonly rewards: LCDTokenAmountSetRaw[]
}

export interface FarmRewardsLCDRaw {
  pagination: { next_key: any; total: string }
  readonly rewards: FarmRewardLCDRaw[]
}

export type FarmRewardsLCD = {
  readonly rewards: LCDTokenAmountSet[]
}

// * airdrop claim
// mainnet rpc
export interface AirdropClaimLCDRaw {
  readonly claim_record: {
    airdrop_id: string
    recipient: string
    initial_claimable_coins: LCDTokenAmountSetRaw[]
    claimable_coins: LCDTokenAmountSetRaw[]
    claimed_conditions: string[]
  }
}

// backend
export interface AirdropClaimRaw {
  readonly dexAirdropTotalCre: string
  readonly Owner: string
  readonly AirdropId: string
  readonly initialClaimableCoins: string
  readonly claimableCoins: string
  readonly claimedConditions: string
  readonly height: number
  readonly timestamp: number
}
