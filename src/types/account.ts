import BigNumber from 'bignumber.js'

// * common subset for LCD response
export interface Pagination {
  next_key: any
  total: string
}

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
  pagination: Pagination
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
  pagination: Pagination
}

export type StakedLCD = { readonly stakings: StakedByPoolLCD[] }

// backend
export interface LpFarmRewardRaw {
  rewardDenom: string
  rewardAmount: number
}

export interface LpFarmReward {
  rewardDenom: string
  rewardAmount: BigNumber
}

export type HarvestableStaked = Omit<LpFarmRewardRaw, 'rewardAmount'> & { rewardAmount: BigNumber }

export interface StakedRaw {
  readonly denom: string
  readonly queuedAmount: string
  readonly stakedAmount: string
  readonly harvestable: LpFarmRewardRaw[]
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

/** @summary replace above from v3 */
export interface LpFarmStakingRaw {
  readonly denom: string
  readonly stakedAmount: string
  readonly harvestable: LpFarmRewardRaw[]
}

export type LpFarmStaking = Omit<LpFarmStakingRaw, 'stakedAmount' | 'harvestable'> & {
  readonly stakedAmount: BigNumber
  readonly harvestable: LpFarmReward[]
}

export interface LpFarmPositionLCDRaw {
  readonly farmer: string
  readonly denom: string
  readonly farming_amount: string
  readonly previous_period: string
  readonly starting_block_height: string
}

export interface LpFarmPositionsLCDRaw {
  positions: LpFarmPositionLCDRaw[]
  pagination: Pagination
}

// * farm reward
// mainnet rpc
export interface LpFarmRewardsLCDRaw {
  readonly rewards: TokenAmountSetRaw[]
}
export type FarmRewardLCDMainnet = Omit<LpFarmRewardsLCDRaw, 'rewards'> & {
  readonly rewards: TokenAmountSet[]
}

// testnet rpc
export interface FarmRewardLCDRaw {
  readonly staking_coin_denom: string
  readonly rewards: TokenAmountSetRaw[]
}

export type LpFarmRewardsLCD = {
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

export type AirdropClaimLCD = {
  readonly initial_claimable_coins: TokenAmountSet[]
  readonly claimable_coins: TokenAmountSet[]
  readonly airdrop_id: string
  readonly recipient: string
  readonly claimed_conditions: string[]
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

export type AirdropClaim = Omit<AirdropClaimRaw, 'initialClaimableCoins' | 'claimableCoins' | 'claimedConditions'> & {
  readonly initialClaimableCoins: TokenAmountSet[]
  readonly claimableCoins: TokenAmountSet[]
  readonly claimedConditions: string[]
}
