import BigNumber from 'bignumber.js'

export interface ProposalsListRaw {
  type: string
  updateTimestamp: number
  rawData: ProposalsListData[]
}

// accounts rank usd
export interface ProposalsListData {
  chain: string
  id: string
  propStatus: string
  time: string
  title: string
  voted: number
  votingEndTime: string
  votingStartTime: string
}

