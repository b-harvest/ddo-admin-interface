import BigNumber from 'bignumber.js'
import { CHAIN_IDS } from 'constants/chain'

export const isTestnet = (chainId: CHAIN_IDS) => chainId === CHAIN_IDS.MOONCAT

export const getLastBlockHeightOf = (height?: string) => {
  return height && Number(height) > 1 ? new BigNumber(height).minus(1).toString() : '1'
}
