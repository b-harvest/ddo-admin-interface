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
