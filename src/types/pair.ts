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

export type PairLive = Omit<PairLiveRaw, 'lastPrice' | 'predPrice' | 'vol_24' | 'totalReserved'> & {
  lastPrice: BigNumber
  predPrice: BigNumber
  vol_24: BigNumber
  totalReserved: { denom: string; priceOracle: BigNumber; amount: BigNumber }[]
}

export interface PairDetail extends PairLive {
  baseAsset: Asset | undefined
  quoteAsset: Asset | undefined
  tvlUSD: BigNumber
  vol24USD: BigNumber
  pools: PoolInPair[]
  assetTickers: AssetTicker[]
}
