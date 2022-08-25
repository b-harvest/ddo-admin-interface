import { IconType } from 'components/Icon'

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
export enum VOTE_WARNING_STATUS {
  PenaltyConfirmed = 'vote_penalty_confirmed',
  Penalty = 'vote_penalty',
  WarningConfirmed = 'vote_warning_confirmed',
  Warned = 'vote_warning',
  NotYet = '',
}

export const WARNING_STATUS_ICON_TYPE_MAP: Record<VOTE_WARNING_STATUS, IconType> = {
  [VOTE_WARNING_STATUS.PenaltyConfirmed]: 'slash',
  [VOTE_WARNING_STATUS.Penalty]: 'loader',
  [VOTE_WARNING_STATUS.WarningConfirmed]: 'warning',
  [VOTE_WARNING_STATUS.Warned]: 'loader',
  [VOTE_WARNING_STATUS.NotYet]: 'plus',
}

export const WARNING_STATUS_VOTE_DESC_MAP: Record<VOTE_WARNING_STATUS, string> = {
  [VOTE_WARNING_STATUS.PenaltyConfirmed]: 'Penalty confirmed',
  [VOTE_WARNING_STATUS.Penalty]: 'Under penalty',
  [VOTE_WARNING_STATUS.WarningConfirmed]: 'Warning confirmed',
  [VOTE_WARNING_STATUS.Warned]: 'Warned',
  [VOTE_WARNING_STATUS.NotYet]: 'Safe',
}
