import BigNumber from 'bignumber.js'

export interface LSVRaw {
  addr: string
  valOperAddr: string
  valConsAddr: string
  blockStartHeight: number
  lsvStartTimestamp: number
  tombstoned: number
  tokens: string
  jailUntilTimestamp: number
  missingBlockCounter: number
  alias: string
  commission: string
}

export type LSV = Omit<LSVRaw, 'tokens' | 'commission'> & {
  tokens: BigNumber
  commission: number
  jailed: boolean
  immediateKickout: boolean
}
