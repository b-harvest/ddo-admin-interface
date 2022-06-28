import type { ResponseViaSWR } from 'types/api'

export interface AssetInfo {
  readonly denom: string
  readonly ticker: string
  readonly chainId: string
  readonly logoUrl: string
  readonly baseDenom: string
  readonly chainName: string
  readonly exponent: number
}

export type AssetInfosRes = ResponseViaSWR<AssetInfo[]>
