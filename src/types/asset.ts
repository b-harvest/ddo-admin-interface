import type { ResponseViaSWR } from 'types/api'

export interface AssetInfo {
  readonly denom: string
  readonly ticker: string
  readonly chainName: string
  readonly logoUrl: string
  readonly baseDenom: string
  readonly chainId: string
  readonly exponent: number
}

export type AssetInfosRes = ResponseViaSWR<AssetInfo[]>
