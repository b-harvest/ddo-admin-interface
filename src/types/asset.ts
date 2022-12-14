import BigNumber from 'bignumber.js'
import { TokenTypes } from 'constants/asset'

// info
export interface AssetInfoRaw {
  readonly denom: string
  readonly ticker: string
  readonly chainName: string
  readonly logoUrl: string
  readonly baseDenom: string
  readonly chainId: string
  readonly exponent: number
  readonly chains?: string
}

export type AssetInfo = AssetInfoRaw

// live
export interface AssetLiveRaw {
  readonly denom: string
  readonly priceOracle: number
  readonly updateTimestamp: number
}

export type AssetLive = Omit<AssetLiveRaw, 'priceOracle'> & {
  priceOracle: BigNumber
}

// union type
export type Asset = AssetInfo & {
  live?: Omit<AssetLive, 'denom'>
  isPoolToken: boolean
  tokenType: TokenTypes
}

// util type
export type AssetTicker = {
  logoUrl: string
  ticker: string
}

export interface AssetDetail extends Asset {
  priceOracle: BigNumber | undefined
  vol24USD: BigNumber | undefined
  tvlUSD: BigNumber | undefined
  farmStakedUSD: BigNumber | undefined
  totalSupplyUSD: BigNumber | undefined
  farmStakedRate?: number
  unfarmedRate?: number
}
