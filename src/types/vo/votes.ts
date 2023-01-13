import BigNumber from 'bignumber.js'

export interface VotesListRaw {
  type: string
  updateTimestamp: number
  rawData: VotesListData[]
}

// accounts rank usd
export interface VotesListData {
  address: string
  chain: string
  feeAmount: number
  feeAmountBig: BigNumber
  feeDenom: string
  height: number
  note: string
  option: string
  proposalId: number
  timestamp: string
  txHash: string
  walletCode: string
}

