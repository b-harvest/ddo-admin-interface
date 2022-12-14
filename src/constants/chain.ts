export const MAINNET_CHAIN_NAME = 'mainnet'
export const TESTNET_CHAIN_NAME = 'mooncat'

export enum CHAIN_IDS {
  MAINNET = 'crescent-1',
  MOONCAT = 'mooncat-2-external',
}

export const CHAIN_NAMES_MAP = {
  [CHAIN_IDS.MAINNET]: 'mainnet',
  [CHAIN_IDS.MOONCAT]: 'mooncat',
}

export const CHAINS_VALID_TIME_DIFF_MAP = {
  [CHAIN_IDS.MAINNET]: 12000,
  [CHAIN_IDS.MOONCAT]: 6000,
}

export const COMMON_FETCHING_INTERVAL = 5000
