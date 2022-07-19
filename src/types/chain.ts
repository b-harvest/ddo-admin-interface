export interface ChainInfo {
  readonly chainId: string
  readonly chainLogo: string
  readonly chainName: string
  readonly coinType: number
  readonly currencies: { coinDecimals: number; coinDenom: string; coinMinimalDenom: string }[]
}

export interface ChainLive {
  readonly chainId: string
  readonly height: string
  readonly timeout: string
  readonly updateTimestamp: string
}

export interface Chain extends ChainInfo {
  live?: Omit<ChainLive, 'denom'>
}

// no more used
export type BlockEvent = {
  name: string
  count: number
}

// lcd
export interface BlockIdLCD {
  hash: string
  parts: {
    total: number
    hash: string
  }
}

export interface BlockLCD {
  block_id: BlockIdLCD
  block: {
    header: {
      version: { block: string }
      chain_id: string
      height: string
      time: string
      last_block_id: BlockIdLCD
      last_commit_hash: string
      data_hash: string
      validators_hash: string
      next_validators_hash: string
      consensus_hash: string
      app_hash: string
      last_results_hash: string
      evidence_hash: string
      proposer_address: string
    }
    data: {
      txs: any[]
    }
    evidence: {
      evidence: any[]
    }
    last_commit: {
      height: string
      round: number
      block_id: BlockIdLCD
      signatures: {
        block_id_flag: number
        validator_address: string
        timestamp: string
        signature: string
      }[]
    }
  }
}
