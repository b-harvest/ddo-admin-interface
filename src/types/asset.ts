import BigNumber from 'bignumber.js'

// info
export interface AssetInfoRaw {
  readonly denom: string
  readonly ticker: string
  readonly chainName: string
  readonly logoUrl: string
  readonly baseDenom: string
  readonly chainId: string
  readonly exponent: number
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
}
