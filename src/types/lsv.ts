import BigNumber from 'bignumber.js'

// jail, commission
export interface LSVRaw {
  addr: string
  valOperAddr: string
  valConsAddr: string
  valHexAddr: string
  blockStartHeight: number
  lsvStartTimestamp: number
  tombstoned: number
  tokens: string
  jailUntilTimestamp: number
  missingBlockCounter: number
  alias: string
  commission: string
  penaltyTotal: number
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

export type BlockProposingLSV = {
  valHexAddr: string
  height: string
  time: string
  nextBlockTime: string
  blockCommitTime: number
}

export type LSV = Omit<LSVRaw, 'tokens' | 'commission'> & {
  tokens: BigNumber
  commission: number
  jailed: boolean
  immediateKickout: boolean
  // vote
  voteData: LSVVote | undefined
  votingRate: number
  // block proposing
  lastProposingBlock: BlockProposingLSV | undefined
}

// lsv event
export interface LSVEventRawJsonBase {
  addr: string
}

export interface LSVEventRawJsonCommissionChanged extends LSVEventRawJsonBase {
  chagned: number
  commision: string
}

export type LSVEventRawJsonJailed = LSVEventRawJsonBase

export interface LSVEventRawJsonBlockMissing extends LSVEventRawJsonBase {
  percentage: string
  missing_block: number
}

export interface LSVEventRawJsonNoSigning extends LSVEventRawJsonBase {
  last_height: number
}

export interface LSVEventRawJsonReliabilityWarn extends LSVEventRawJsonBase {
  desc: string
}

export interface LSVEventRawJsonVoteWarn extends LSVEventRawJsonBase {
  desc: string
  proposalId: number
}

export interface LSVEventRawJsonBadPerformance extends LSVEventRawJsonBase {
  desc: string
}

export type LSVEventType =
  | 'commssion_changed'
  | 'jailed'
  | 'block_missing'
  | 'no_signing'
  | 'bad_performance'
  | 'reliabiity_warning'
  | 'vote_warning'
  | 'reliability_penalty'
  | 'vote_penalty'

export interface LSVEventRawBase {
  eid: number
  event: LSVEventType
  height: number
  timestamp: number
  penaltyPoint: number
  confirmResult: string // y: confirm, n, d: discard
  confirmId: string
  confirmTimestamp: string
  confirmMsg: string
  regId: string
}

export interface LSVEventCommissionChanged extends LSVEventRawBase {
  event: 'commssion_changed'
  rawJson: LSVEventRawJsonCommissionChanged | null
}

export interface LSVEventJailed extends LSVEventRawBase {
  event: 'jailed'
  rawJson: LSVEventRawJsonJailed | null
}

export interface LSVEventBlockMissing extends LSVEventRawBase {
  event: 'block_missing'
  rawJson: LSVEventRawJsonBlockMissing | null
}

export interface LSVEventNoSigning extends LSVEventRawBase {
  event: 'no_signing'
  rawJson: LSVEventRawJsonNoSigning | null
}

export interface LSVEventBadPerformance extends LSVEventRawBase {
  event: 'bad_performance'
  rawJson: LSVEventRawJsonBadPerformance | null
}

export interface LSVEventReliabilityWarn extends LSVEventRawBase {
  event: 'reliabiity_warning'
  rawJson: LSVEventRawJsonReliabilityWarn | null
}

export interface LSVEventVoteWarn extends LSVEventRawBase {
  event: 'vote_warning'
  rawJson: LSVEventRawJsonVoteWarn | null
}

export type LSVEventRaw =
  | LSVEventCommissionChanged
  | LSVEventJailed
  | LSVEventBlockMissing
  | LSVEventNoSigning
  | LSVEventBadPerformance
  | LSVEventReliabilityWarn
  | LSVEventVoteWarn
