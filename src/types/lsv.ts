import BigNumber from 'bignumber.js'

// jail, commission
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

// vote
export interface VoteRaw {
  vote: { option: number; weight: string }
  proposalId: number
}

export interface LSVVoteRaw {
  addr: string
  voteCnt: number
  mustVoteCnt: number
  votes: VoteRaw[]
}

export type Vote = Omit<VoteRaw, 'vote'> & {
  vote: { option: number; optionAlias: string; weight: number }
}

export type LSVVote = Omit<LSVVoteRaw, 'votes'> & {
  votes: Vote[]
}

export type LSV = Omit<LSVRaw, 'tokens' | 'commission'> & {
  tokens: BigNumber
  commission: number
  jailed: boolean
  immediateKickout: boolean
  // vote
  voteData: LSVVote | undefined
}
