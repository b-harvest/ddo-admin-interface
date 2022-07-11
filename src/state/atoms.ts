import { CHAIN_IDS } from 'constants/chain'
import { atom } from 'jotai'
import type { AssetInfoRaw, AssetLiveRaw } from 'types/asset'
import type { ChainInfo, ChainLive } from 'types/chain'
import type { PairInfoRaw, PairLiveRaw } from 'types/pair'
import type { PoolLiveRaw } from 'types/pool'

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

export const allAssetInfoAtomRef = atom<AssetInfoRaw[]>([])

export const allAssetLiveAtomRef = atom<AssetLiveRaw[]>([])

export const allPairInfoAtomRef = atom<PairInfoRaw[]>([])

export const allPairLiveAtomRef = atom<PairLiveRaw[]>([])

export const allPoolLiveAtomRef = atom<PoolLiveRaw[]>([])

// balanceAtom
export const balanceAtom = atom(undefined)
