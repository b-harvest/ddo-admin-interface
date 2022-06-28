import type { ResponseViaSWR } from 'types/api'

export interface Balance {
  readonly address: string
  readonly asset: { denom: string; amount: string; reserved: string }[]
  readonly unbonding?: { CompleteTimestamp: number; txhash: string; amount: string; unbondingAmount: string }[] | null
}

export type BalanceRes = ResponseViaSWR<Balance>
