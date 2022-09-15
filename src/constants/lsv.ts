import { IconType } from 'components/Icon'
import { PENALTY_STATUS, PENALTY_TYPE, PenaltyEvent } from 'types/lsv'

// vote-specific
export const SAFE_VOTING_RATE = 80

export enum VoteOptions {
  NA = 0,
  YES = 1,
  ABSTAIN = 2,
  NO = 3,
  VETO = 4,
  DIDNOT = 5,
}

export const WARNABLE_VOTE_OPTIONS = [VoteOptions.DIDNOT]

// penalty
export const IMMEDIATE_KICKOUT_PENALTIES: PenaltyEvent[] = ['commssion_changed']
export const WRITABLE_PENALTIES: PenaltyEvent[] = ['reliability_warning', 'vote_warning'] // except for vote
export const REF_LINKED_PENALTIES: PenaltyEvent[] = [
  'reliability_warning',
  'reliability_penalty',
  'vote_warning',
  'vote_penalty',
]

export const PENALTY_TYPE_ICON_MAP: Record<PENALTY_TYPE, IconType> = {
  [PENALTY_TYPE.Warning]: 'warning',
  [PENALTY_TYPE.Strike]: 'strike',
  [PENALTY_TYPE.immediateKickout]: 'slash',
}

export const PENALTY_TYPE_COLOR_MAP: Record<PENALTY_TYPE, string> = {
  [PENALTY_TYPE.Warning]: 'text-warning',
  [PENALTY_TYPE.Strike]: 'text-warning',
  [PENALTY_TYPE.immediateKickout]: 'text-error',
}

export const PENALTY_TYPE_DESC_MAP: Record<PENALTY_TYPE, string> = {
  [PENALTY_TYPE.Warning]: 'Warning',
  [PENALTY_TYPE.Strike]: '1 strike',
  [PENALTY_TYPE.immediateKickout]: 'Immediate kickout',
}

export const PENALTY_STATUS_ICON_MAP: Record<PENALTY_STATUS, IconType> = {
  [PENALTY_STATUS.Confirmed]: 'checked',
  [PENALTY_STATUS.NotConfirmed]: 'unchecked',
  [PENALTY_STATUS.Discarded]: 'discarded',
}

export const LSV_OBSERVATION_DESC_JAILED = `Jail time has ever changed out of 0`
export const LSV_OBSERVATION_DESC_COMMISSION = `Commission rate higher than 20% over 3 days totally(accumulative)`
export const LSV_OBSERVATION_DESC_STABILITY = `Block missing percentage over 10% every week`
export const LSV_OBSERVATION_DESC_SUSTAINABILITY = `Take over 6-hours in succession without block signing`
export const LSV_OBSERVATION_DESC_RELIABILITY = `When validator meets 2 items out of 3\n• Binary upgrade in 3 hours (related to software)\n• Emergency response in 12 hours\n• Node config upgrade in 24 hours (related with local setting ex, block time control, node parameter)`
export const LSV_OBSERVATION_DESC_ENGAGEMENT = `When validator meets 1 item out of 3\n• When the validator does not participate in governance actively, Crescent foundation gives a warning. If the validator does not vote even validator gets a warning\n• If a specific validator’s voting rate is less than 50% since they join LSV\n• When specific validator votes ‘abstain’ habitually in succession`
export const LSV_OBSERVATION_DESC_PERFORMANCE = `When proposing Diff(the actual number of proposing blocks compared with voting power) is less than 90% with 2 months of data`
export const LSV_OBSERVATION_DESC_ACTIVITY = `When a specific validator’s Expected TX share(actual handled TX is divided by expected TX) is less than 50% with 2 months of data`

export const LSV_VOTE_WARN_REFERENCE_SEPERATOR = '/n/n'

export const LSV_PENALTY_DATA_DESC_MAP: Record<PenaltyEvent, string | undefined> = {
  commssion_changed: `Commission rate > 20%`,
  jailed: undefined,
  block_missing: `Over 10% of 30000 blocks`,
  no_signing: undefined,
  bad_performance: `The sum of txs from the latest 50 blocks <= 5`,
  reliability_warning: undefined,
  vote_warning: undefined,
  reliability_penalty: undefined,
  vote_penalty: undefined,
  lsv_registered: undefined,
}
