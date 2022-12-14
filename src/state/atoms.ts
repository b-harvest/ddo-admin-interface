import { CHAIN_IDS } from 'constants/chain'
import api from 'data/api'
import { atom } from 'jotai'
import type { AssetInfoRaw, AssetLiveRaw } from 'types/asset'
import type { BlockLCD, ChainInfo, ChainLive } from 'types/chain'
import type { PairInfoRaw, PairLiveRaw } from 'types/pair'
import type { PoolLiveRaw } from 'types/pool'

// darkmode
const LOCAL_STORAGE_KEY_IS_DARK_MODE = `is-dark-mode`
const isDarkModeFromLocal = localStorage.getItem(LOCAL_STORAGE_KEY_IS_DARK_MODE)

const isDarkModeAtom = atom<boolean>((isDarkModeFromLocal ?? 'true') === 'true')
export const isDarkModeAtomRef = atom(
  (get) => get(isDarkModeAtom),
  (_, set, { isDarkMode }: { isDarkMode: boolean }) => {
    set(isDarkModeAtom, isDarkMode)
    localStorage.setItem(LOCAL_STORAGE_KEY_IS_DARK_MODE, isDarkMode.toString())
  }
)

const LOCAL_STORAGE_KEY_AUTH_TOKEN = `authToken`
const authTokenFromLocal = localStorage.getItem(LOCAL_STORAGE_KEY_AUTH_TOKEN)

const authTokenAtom = atom<string | null>(authTokenFromLocal ?? null)
export const authTokenAtomRef = atom(
  (get) => get(authTokenAtom),
  (_, set, { authToken }: { authToken: string | null }) => {
    set(authTokenAtom, authToken)
    api.defaults.headers.common['Authorization'] = authToken ? `Bearer ${authToken}` : ''
    if (authToken) localStorage.setItem(LOCAL_STORAGE_KEY_AUTH_TOKEN, authToken)
    else localStorage.removeItem(LOCAL_STORAGE_KEY_AUTH_TOKEN)
  }
)

// chaiIdAtom (persisting in localStorage)
export type ChainId = CHAIN_IDS
export const LOCAL_STORAGE_KEY_CHAIN_ID = `chain-id`

const isValidChainId = (Object.values(CHAIN_IDS) as string[]).includes(
  localStorage.getItem(LOCAL_STORAGE_KEY_CHAIN_ID) ?? ''
)

const chaiIdAtom = atom<ChainId>(
  isValidChainId ? (localStorage.getItem(LOCAL_STORAGE_KEY_CHAIN_ID) as CHAIN_IDS) : CHAIN_IDS.MAINNET
)
export const chainIdAtomRef = atom(
  (get) => get(chaiIdAtom),
  (_, set, { chainId }: { chainId: ChainId }) => {
    set(chaiIdAtom, chainId)
    localStorage.setItem(LOCAL_STORAGE_KEY_CHAIN_ID, chainId)
  }
)

// backend data
export const allChainInfoAtomRef = atom<ChainInfo[]>([])
export const allChainLiveAtomRef = atom<ChainLive[]>([])
export const latestBlockLCDAtomRef = atom<BlockLCD | undefined>(undefined)

export const allAssetInfoAtomRef = atom<AssetInfoRaw[]>([])
export const allAssetLiveAtomRef = atom<AssetLiveRaw[]>([])

export const allPairInfoAtomRef = atom<PairInfoRaw[]>([])
export const allPairLiveAtomRef = atom<PairLiveRaw[]>([])

export const allPoolLiveAtomRef = atom<PoolLiveRaw[]>([])

// balanceAtom
export const balanceAtom = atom(undefined)
