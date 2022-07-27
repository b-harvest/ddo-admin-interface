import BigNumber from 'bignumber.js'

// accounts rank usd
interface RankDataRaw {
  addr: string
  usd: number
  lastAct: number
}

export type RankData = Omit<RankDataRaw, 'usd'> & {
  usd: BigNumber
  rank: number
}

export interface AccountRankRaw {
  rankType: string
  updateTimestamp: number
  rankData: RankDataRaw[]
}

export type AccountRank = Omit<AccountRankRaw, 'rankData'> & {
  rankData: RankData[]
}

// tvl usd
interface TVLUSDByPoolRaw {
  tvl: number
  pool: number
}

export interface TVLUSDByDateRaw {
  date: string
  tvl: number
  detail: TVLUSDByPoolRaw[]
}

// vol usd
interface VolUSDByPairRaw {
  pair: number
  usd_vol: number
}

export interface VolUSDByDateRaw {
  date: string
  vol: number
  detail: VolUSDByPairRaw[]
}
