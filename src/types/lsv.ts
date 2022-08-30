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
export enum PENALTY_TYPE {
  Warning = 'Warning',
  Strike = '1 strike',
  immediateKickout = 'Immediate kickout',
}

export enum PENALTY_STATUS {
  Confirmed = 'confirmed',
  NotConfirmed = 'not confirmed',
  Discarded = 'discarded',
}

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
  desc?: string
}

export interface LSVEventRawJsonVoteWarn extends LSVEventRawJsonBase {
  desc?: string
  proposalId: number
}

export interface LSVEventRawJsonBadPerformance extends LSVEventRawJsonBase {
  desc?: string
}

export type PenaltyEvent =
  | 'commssion_changed'
  | 'jailed'
  | 'block_missing'
  | 'no_signing'
  | 'bad_performance'
  | 'reliability_warning'
  | 'vote_warning'
  | 'reliability_penalty'
  | 'vote_penalty'

export type WritablePenalty = 'vote_warning' | 'reliability_warning'

export interface LSVEventRawBase {
  eid: number
  event: PenaltyEvent
  height: number
  timestamp: number
  penaltyPoint: number
  confirmResult: 'y' | 'n' | 'd' // y: confirm, n, d: discard
  confirmId: string
  confirmTimestamp: string
  confirmMsg: string
  regId: string
}

export type Penalty = Omit<LSVEventRawBase, 'height' | 'confirmTimestamp' | 'regId' | 'confirmId'> & {
  height: number | undefined
  confirmTimestamp: number
  regId: string | undefined
  confirmId: string | undefined
  // custom
  posterId: string | undefined
  postTimestamp: number
  type: PENALTY_TYPE
  status: PENALTY_STATUS
  dataDesc: string | undefined
  rawJson: any
}

export type VotePenalty = Omit<Penalty, 'rawJson'> & {
  event: 'vote_warning' | 'vote_penalty'
  rawJson: LSVEventRawJsonVoteWarn
  refLink: string | undefined
  desc: string | undefined
}

// post
export type LSVVoteWarnPost = {
  event_type: 'vote_warning'
  json: {
    addr: string
    desc: string
    proposalId: number
  }
}

export type LSVReliabilityWarnPost = {
  event_type: 'reliability_warning'
  json: {
    addr: string
    desc: string
  }
}

export type LSVPenaltyConfirmPost = {
  eid: number
  json: {
    eid: number
    result: 'y' | 'n' | 'd'
    msg?: string
  }
}

// to be del
export interface LSVEventCommissionChanged extends Penalty {
  event: 'commssion_changed'
  rawJson: LSVEventRawJsonCommissionChanged | null
}

export interface LSVEventJailed extends Penalty {
  event: 'jailed'
  rawJson: LSVEventRawJsonJailed | null
}

export interface LSVEventBlockMissing extends Penalty {
  event: 'block_missing'
  rawJson: LSVEventRawJsonBlockMissing | null
}

export interface LSVEventNoSigning extends Penalty {
  event: 'no_signing'
  rawJson: LSVEventRawJsonNoSigning | null
}

export interface LSVEventBadPerformance extends Penalty {
  event: 'bad_performance'
  rawJson: LSVEventRawJsonBadPerformance | null
}

export interface LSVEventReliabilityWarn extends Penalty {
  event: 'reliability_warning' | 'reliability_penalty'
  rawJson: LSVEventRawJsonReliabilityWarn | null
}

export interface LSVEventVoteWarn extends Penalty {
  event: 'vote_warning' | 'vote_penalty'
  rawJson: LSVEventRawJsonVoteWarn
  status: PENALTY_STATUS
}

// to be del...
export type LSVEventRaw =
  | LSVEventCommissionChanged
  | LSVEventJailed
  | LSVEventBlockMissing
  | LSVEventNoSigning
  | LSVEventBadPerformance
  | LSVEventReliabilityWarn
  | LSVEventVoteWarn

export type LSVEvent = LSVEventRaw
