export interface ChainInfo {
  readonly denom: string
  readonly ticker: string
  readonly chainName: string
  readonly logoUrl: string
  readonly baseDenom: string
  readonly chainId: string
  readonly exponent: number
}

export interface ChainLive {
  readonly chainId: string
  readonly denom: string
  readonly priceOracle: number
  readonly updateTimestamp: number
}

export interface Asset extends ChainInfo {
  live?: Omit<ChainLive, 'denom'>
}
