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

// metric api response data
interface BlockDataRaw {
  timestamp_nano: number
  height: number
  var_int: number // flush time
  var_str: string // events' count
}

export interface BlocksFlushRaw {
  type: 'flush_ts_diff_nano'
  rows: BlockDataRaw[]
}

export interface BlocksEventsRaw {
  type: 'event_row_count'
  rows: BlockDataRaw[]
}

export interface BlockEventIndicatorsRaw {
  type: 'event_row_count'
  indicator: string[]
}
