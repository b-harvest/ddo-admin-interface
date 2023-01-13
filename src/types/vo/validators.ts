import BigNumber from 'bignumber.js'

export interface ValidatorListRaw {
  type: string
  updateTimestamp: number
  rawData: ValidatorListData[]
}

// accounts rank usd
export interface ValidatorListData {
  amount: number
  amountBig: BigNumber
  amountUnit: string
  chain: string
  denom: string
  height: number
  inUsd: number
  inKrw: number
  operationAddress: string
  symbol: string
  time: string
  type: string
  variation: number
  variationBig: BigNumber
  variationValue: number
}

export type ValidatorListDataOmit = Omit<ValidatorListData, 'inUsd' | 'inKrw'> & {
  inUsd: BigNumber
  inKrw: BigNumber
  //rank: number
}
