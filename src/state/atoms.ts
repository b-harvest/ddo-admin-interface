import { CHAIN_IDS, CHAIN_NAMES_MAP } from 'constants/chain'
import { atom } from 'jotai'
import type { AssetInfo } from 'types/asset'

// chaiIdAtom (persisting in localStorage)
export type ChainId = CHAIN_IDS

const chaiIdAtom = atom<ChainId>((localStorage.getItem('chain-id') as ChainId) ?? CHAIN_NAMES_MAP[CHAIN_IDS.MAINNET])
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

// balanceAtom
export const balanceAtom = atom(undefined)
