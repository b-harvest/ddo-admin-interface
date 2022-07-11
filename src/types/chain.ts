export interface ChainInfo {
  readonly chainId: string
  readonly chainLogo: string
  readonly chainName: string
  readonly coinType: number
  readonly currencies: { coinDecimals: number; coinDenom: string; coinMinimalDenom: string }[]
}

export interface ChainLive {
  readonly chainId: string
  readonly height: string
  readonly timeout: string
  readonly updateTimestamp: string
}

export interface Chain extends ChainInfo {
  live?: Omit<ChainLive, 'denom'>
}
