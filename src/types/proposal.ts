import type { TokenAmountSetRaw } from 'types/account'

interface AddPlanRequestLCDRaw {
  name: string
  farming_pool_address: string
  termination_address: string
  staking_coin_weights: { denom: string; amount: string }[]
  start_time: string | null
  end_time: string | null
  epoch_amount: TokenAmountSetRaw[]
  epoch_ratio: string
}

interface ModifyPlanRequestLCDRaw extends AddPlanRequestLCDRaw {
  plan_id: string
}

interface ProposalChangeLCDRaw {
  subspace: string
  key: string
  value: string
}

interface ProposalPlanLCDRaw {
  name: string
  time: string
  height: string
  info: string
  upgraded_client_state: string | null
}

export interface ProposalContentLCDRaw {
  '@type': string
  title: string
  description: string
  add_plan_requests?: AddPlanRequestLCDRaw[]
  modify_plan_requests?: ModifyPlanRequestLCDRaw[]
  delete_plan_requests?: []
  recipient?: string
  amount?: TokenAmountSetRaw[]
  changes?: ProposalChangeLCDRaw[]
  plan: ProposalPlanLCDRaw
}

export type ProposalResultLCDRaw = {
  yes: string
  abstain: string
  no: string
  no_with_veto: string
}

export type ProposalStatus =
  | 'PROPOSAL_STATUS_VOTING_PERIOD'
  | 'PROPOSAL_STATUS_DEPOSIT_PERIOD'
  | 'PROPOSAL_STATUS_PASSED'
  | 'PROPOSAL_STATUS_REJECTED'

export interface ProposalLCDRaw {
  proposal_id: string
  content: ProposalContentLCDRaw
  status: ProposalStatus
  final_tally_result: ProposalResultLCDRaw
  submit_time: string
  deposit_end_time: string
  total_deposit: TokenAmountSetRaw[]
  voting_start_time: string
  voting_end_time: string
}

export interface ProposalRaw {
  proposalId: number
  proposer: string
  proposalType: string
  proposal: ProposalLCDRaw
}
