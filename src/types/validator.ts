export interface ValidatorLCDRaw {
  readonly address: string
  readonly pub_key: {
    type: string
    value: string
  }
  readonly proposer_priority: string
  readonly voting_power: string
}

export interface ValidatorSetsLCDRaw {
  readonly height: string
  readonly result: {
    block_height: string
    validators: ValidatorLCDRaw[]
    total: string
  }
}

export type ValidatorsByHeightLCD = ValidatorSetsLCDRaw['result']
