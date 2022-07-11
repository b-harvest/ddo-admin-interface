import { CHAIN_IDS } from 'constants/chain'
import { atom } from 'jotai'
import type { AssetInfo } from 'types/asset'
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

// assetInfoAtom
export const allAssetInfoAtomRef = atom<AssetInfo[]>([])

// assetInfoAtom
export const allPairInfoAtomRef = atom<PairInfo[]>([])

// assetInfoAtom
export const allPairLiveAtomRef = atom<PairLive[]>([])

// balanceAtom
export const balanceAtom = atom(undefined)
