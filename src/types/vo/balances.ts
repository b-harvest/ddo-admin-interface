import BigNumber from 'bignumber.js'

export interface BalancesListRaw {
  type: string
  updateTimestamp: number
  rawData: BalancesListDataRaw[]
}

// accounts rank usd
export interface BalancesListDataRaw {
  chain: string
  code: string
  address: string
  height: number
  symbol: string
  denom: string
  acountUnit: string
  amount: number
  amountBig: BigNumber
  variation: number
  variationBig: BigNumber
  inUsd: number
  inKrw: number
  delegationBalance: number
  unDelegationBalance: number
}

export type BalancesData = Omit<BalancesListDataRaw, 'inUsd' | 'inKrw'> & {
  inUsd: BigNumber
  inKrw: BigNumber
  //rank: number
}

//export type RankDataRaw = RankDataRaw

// export interface AccountRankRaw {
//   rankType: string
//   updateTimestamp: number
//   rankData: RankDataRaw[]
// }

// export type AccountRank = Omit<AccountRankRaw, 'rankData'> & {
//   rankData: RankData[]
// }

// // tvl usd
// interface TVLUSDByPoolRaw {
//   tvl: number
//   pool: number
// }

// export interface TVLUSDByDateRaw {
//   date: string
//   tvl: number
//   detail: TVLUSDByPoolRaw[]
// }

// export type TVLUSDByPool = {
//   tvl: number
//   pool: number
// }

// export type TVLUSDByDate = {
//   date: number
//   tvl: number
//   detail: TVLUSDByPool[]
// }

// // vol usd
// interface VolUSDByPairRaw {
//   pair: number
//   usd_vol: number
// }

// export interface VolUSDByDateRaw {
//   date: string
//   vol: number
//   detail: VolUSDByPairRaw[]
// }

// export type VolUSDByPair = {
//   pair: number
//   usd_vol: number
// }

// export type VolUSDByDate = {
//   date: number
//   vol: number
//   detail: VolUSDByPair[]
// }
