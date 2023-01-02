import BigNumber from 'bignumber.js'

export interface TestRaw {
  rankType: string
  updateTimestamp: number
  rankData: RankDataRaw[]
}

// accounts rank usd
export interface RankDataRaw {
	address: string
	chain: string
	code: string
	company: string
	//createdAt: string
	purpose: string
  usd: number
}

//export type RankDataRaw = RankDataRaw



export type AccountsData = Omit<RankDataRaw, 'usd'> & {
  usd: BigNumber
  //rank: number
}

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
