export interface AssetInfo {
  readonly denom: string
  readonly ticker: string
  readonly chainName: string
  readonly logoUrl: string
  readonly baseDenom: string
  readonly chainId: string
  readonly exponent: number
}

export interface AssetLive {
  readonly denom: string
  readonly priceOracle: number
  readonly updateTimestamp: number
}
