import type { ResponseViaSWR } from 'types/api'

// rpc
export interface BalanceRPC {
  readonly denom: string
  readonly amount: string
}

// rpc rest
export interface BalanceLCD {
  readonly balances: BalanceRPC[]
  pagination: { next_key: any; total: string }
}

// backend
export interface Balance {
  readonly address: string
  readonly asset: (BalanceRPC & { reserved: string })[]
  readonly unbonding?: { CompleteTimestamp: number; txhash: string; amount: string; unbondingAmount: string }[] | null
}

export type BalanceRes = ResponseViaSWR<Balance>
export type BalanceLCDRes = ResponseViaSWR<BalanceLCD>
