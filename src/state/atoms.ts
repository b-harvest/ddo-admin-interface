import { CHAIN_IDS } from 'constants/chain'
import { atom } from 'jotai'
import type { AssetInfo, AssetLive } from 'types/asset'
import type { ChainInfo, ChainLive } from 'types/chain'
import type { PairInfo, PairLive } from 'types/pair'

// darkmode
const LOCAL_STORAGE_KEY_IS_DARK_MODE = `is-dark-mode`
const isDarkModeAtom = atom<boolean>(Boolean(localStorage.getItem(LOCAL_STORAGE_KEY_IS_DARK_MODE) ?? true))
export const isDarkModeAtomRef = atom(
  (get) => get(isDarkModeAtom),
  (_, set, { isDarkMode }: { isDarkMode: boolean }) => {
    set(isDarkModeAtom, isDarkMode)
    localStorage.setItem(LOCAL_STORAGE_KEY_IS_DARK_MODE, isDarkMode.toString())
  }
)

// chaiIdAtom (persisting in localStorage)
export type ChainId = CHAIN_IDS
const LOCAL_STORAGE_KEY_CHAIN_ID = `chain-id`

const chaiIdAtom = atom<ChainId>((localStorage.getItem(LOCAL_STORAGE_KEY_CHAIN_ID) as CHAIN_IDS) ?? CHAIN_IDS.MAINNET)
export const chainIdAtomRef = atom(
  (get) => get(chaiIdAtom),
  (_, set, { chainId }: { chainId: ChainId }) => {
    set(chaiIdAtom, chainId)
    localStorage.setItem(LOCAL_STORAGE_KEY_CHAIN_ID, chainId)
  }
)

// is testnet
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
