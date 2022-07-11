import { CHAIN_IDS } from 'constants/chain'

export const isTestnet = (chainId: CHAIN_IDS) => chainId === CHAIN_IDS.MOONCAT
