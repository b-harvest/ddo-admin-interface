import { IconType } from 'components/Icon'
import { LSVEventType } from 'types/lsv'

// vote-specific
export const SAFE_VOTING_RATE = 80

export enum VOTE_OPTIONS {
  Yes = 1,
  No = 2,
  Veto = 3,
  Abstain = 4,
  DidNot = 5,
  NA = 6,
}

export const WARNABLE_VOTE_OPTIONS = [VOTE_OPTIONS.DidNot, VOTE_OPTIONS.Abstain]

// common warning
export enum PENALTY_STATUS {
  PenaltyConfirmed,
  Penalty,
  WarningConfirmed,
  Warned,
  NotYet,
}

export const WARNING_STATUS_ICON_TYPE_MAP: Record<PENALTY_STATUS, IconType> = {
  [PENALTY_STATUS.PenaltyConfirmed]: 'slash',
  [PENALTY_STATUS.Penalty]: 'loader',
  [PENALTY_STATUS.WarningConfirmed]: 'warning',
  [PENALTY_STATUS.Warned]: 'loader',
  [PENALTY_STATUS.NotYet]: 'plus',
}

export const WARNING_STATUS_VOTE_DESC_MAP: Record<PENALTY_STATUS, string> = {
  [PENALTY_STATUS.PenaltyConfirmed]: 'Penalty confirmed',
  [PENALTY_STATUS.Penalty]: 'Under penalty',
  [PENALTY_STATUS.WarningConfirmed]: 'Warning confirmed',
  [PENALTY_STATUS.Warned]: 'Warned',
  [PENALTY_STATUS.NotYet]: 'Safe',
}

export const WRITABLE_PENALTIES: LSVEventType[] = ['reliabiity_warning'] // except for vote
