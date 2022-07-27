import BigNumber from 'bignumber.js'

// * common subset for LCD response
export interface TokenAmountSetRaw {
  readonly denom: string
  readonly amount: string
}

export type TokenAmountSet = Omit<TokenAmountSetRaw, 'amount'> & {
  readonly amount: BigNumber
}

// * balance
// rpc
// export type BalanceLCD = TokenAmountSetRaw

// rpc rest
export interface BalanceLCDRaw {
  readonly balances: TokenAmountSetRaw[]
  pagination: { next_key: any; total: string }
}

// backend
export interface BalanceRaw {
  readonly address: string
  readonly asset: (TokenAmountSetRaw & { reserved: string })[]
  readonly unbonding?: { CompleteTimestamp: number; txhash: string; amount: string; unbondingAmount: string }[] | null
}

export type Balance = (TokenAmountSet & { reserved: string })[]

// * staked
// mainnet rpc
export interface StakedLCDMainnetRaw {
  staked_coins: TokenAmountSetRaw[]
  queued_coins: TokenAmountSetRaw[]
}

export type StakedLCDMainnet = {
  staked_coins: TokenAmountSet[]
  queued_coins: TokenAmountSet[]
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
  readonly staked_coins: TokenAmountSetRaw[]
  readonly queued_coins: TokenAmountSetRaw[]
  readonly rewards: TokenAmountSetRaw[]
}

// * farm reward
// mainnet rpc
export interface FarmRewardLCDMainnetRaw {
  readonly rewards: TokenAmountSetRaw[]
}
export type FarmRewardLCDMainnet = Omit<FarmRewardLCDMainnetRaw, 'rewards'> & {
  readonly rewards: TokenAmountSet[]
}

// testnet rpc
export interface FarmRewardLCDRaw {
  readonly staking_coin_denom: string
  readonly rewards: TokenAmountSetRaw[]
}

export interface FarmRewardsLCDRaw {
  pagination: { next_key: any; total: string }
  readonly rewards: FarmRewardLCDRaw[]
}

export type FarmRewardsLCD = {
  readonly rewards: TokenAmountSet[]
}

// * airdrop claim
// mainnet rpc
export interface AirdropClaimLCDRaw {
  readonly claim_record: {
    airdrop_id: string
    recipient: string
    initial_claimable_coins: TokenAmountSetRaw[]
    claimable_coins: TokenAmountSetRaw[]
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
