import BigNumber from 'bignumber.js'
import type { Asset, AssetTicker } from 'types/asset'

// info
interface PoolInPairRaw {
  poolId: number
  // poolType: number
  poolDenom: string
  totalSupply: string
  reserved: { denom: string; amount: string }[]
}

export type PoolInPair = Omit<PoolInPairRaw, 'totalSupply' | 'reserved'> & {
  totalSupply: BigNumber
  reserved: { denom: string; amount: BigNumber }[]
}

export interface PairInfoRaw {
  pairId: number
  baseDenom: string
  quoteDenom: string
  lastPrice: string
  pools: PoolInPairRaw[]
}

export type PairInfo = Omit<PairInfoRaw, 'lastPrice' | 'pools'> & {
  lastPrice: BigNumber
  pools: PoolInPair[]
}

// live
export interface PairLiveRaw {
  baseDenom: string
  change_24: number
  high_24: number
  lastPrice: string
  low_24: number
  open_24: number
  pairId: number
  predPrice: string
  quoteDenom: string
  ts_24: number
  vol_24: number
  totalReserved: { denom: string; priceOracle: number; amount: string }[]
}

export type PairLive = Omit<
  PairLiveRaw,
  'lastPrice' | 'predPrice' | 'high_24' | 'low_24' | 'vol_24' | 'totalReserved'
> & {
  lastPrice: BigNumber
  predPrice: BigNumber
  diffExpo: number
  high_24: BigNumber
  low_24: BigNumber
  vol_24: BigNumber
  totalReserved: { denom: string; priceOracle: BigNumber; amount: BigNumber }[]
}

export interface PairDetail extends PairLive {
  baseAsset: Asset
  quoteAsset: Asset
  exponentDiff: number
  tvlUSD: BigNumber
  vol24USD: BigNumber
  volTvlRatio: number
  pools: PoolInPair[]
  assetTickers: [AssetTicker, AssetTicker]
}
