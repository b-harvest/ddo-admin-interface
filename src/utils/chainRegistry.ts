import { assets, chains, ibc } from 'chain-registry'

export enum COSMOS_CHAIN_NAME {
  crescent = 'crescent',
  axelar = 'axelar',
  gbridge = 'gravitybridge',
  osmosis = 'osmosis',
  evmos = 'evmos',
}

export enum COSMOS_API_PROVIDER {
  crescent = 'crescent',
  axelar = 'Notional',
  gravitybridge = 'Notional',
  osmosis = 'Notional', //'Osmosis Foundation',
  evmos = 'Blockdaemon',
}

export enum COSMOS_CHAIN_ID_MAP {
  crescent = 'cre',
  axelar = 'axl',
  gravitybridge = 'graviton',
  osmosis = 'osmo',
  evmos = 'evmos',
}

export type ChainAPISet = {
  address: string
  provider: string
}

export const findAssetsByChain = (chainName: COSMOS_CHAIN_NAME) => {
  return assets.find(({ chain_name }) => chain_name === chainName)
}

export const findChainByName = (chainName: COSMOS_CHAIN_NAME) => {
  return chains.find(({ chain_name }) => chain_name === chainName)
}

export const findIBCByChain = (chainName: COSMOS_CHAIN_NAME) => {
  return ibc.find((item) => item['chain-2']['chain-name'] === chainName)
}

export const restAPIUrlOf = (chainName: COSMOS_CHAIN_NAME, APIProvider: COSMOS_API_PROVIDER) => {
  const chain = findChainByName(chainName)
  const address = chain?.apis?.rest?.find(({ provider }: ChainAPISet) => provider === APIProvider)?.address as
    | string
    | undefined
  return address?.at(-1) === '/' ? address.slice(0, -1) : address
}

export const mintscanUrlOf = (chainName: COSMOS_CHAIN_NAME) => {
  const chain = findChainByName(chainName)
  const url = chain?.explorers?.find(({ kind }: { kind: string }) => kind === 'mintscan')?.url as string | undefined
  return url
}

export const openExplorerByChain = (chainName: COSMOS_CHAIN_NAME, height?: string) => {
  const url = mintscanUrlOf(chainName)
  if (!url) return null

  const tail = height ? `/${height}` : ''
  window.open(`${url}/blocks${tail}`, '_blank')
}
