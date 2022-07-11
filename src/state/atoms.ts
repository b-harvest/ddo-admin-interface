import { CHAIN_IDS } from 'constants/chain'
import { atom } from 'jotai'
import type { AssetInfo, AssetLive } from 'types/asset'
import type { ChainInfo, ChainLive } from 'types/chain'
import type { PairInfo, PairLive } from 'types/pair'

// chaiIdAtom (persisting in localStorage)
export type ChainId = CHAIN_IDS

const chaiIdAtom = atom<ChainId>((localStorage.getItem('chain-id') as CHAIN_IDS) ?? CHAIN_IDS.MAINNET)
export const chainIdAtomRef = atom(
  (get) => get(chaiIdAtom),
  (_, set, { chainId }: { chainId: ChainId }) => {
    set(chaiIdAtom, chainId)
    localStorage.setItem('chain-id', chainId)
  }
)

export const isTestnetAtomRef = atom<boolean>(false)

// backend data
export const allChainInfoAtomRef = atom<ChainInfo[]>([])

export const allChainLiveAtomRef = atom<ChainLive[]>([])

export const allAssetInfoAtomRef = atom<AssetInfo[]>([])

export const allAssetLiveAtomRef = atom<AssetLive[]>([])

export const allPairInfoAtomRef = atom<PairInfo[]>([])

export const allPairLiveAtomRef = atom<PairLive[]>([])

// balanceAtom
export const balanceAtom = atom(undefined)
