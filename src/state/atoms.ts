import { MAINNET_CHAIN_NAME, TESTNET_CHAIN_NAME } from 'constants/names'
import { atom } from 'jotai'

// chainNameAtom (persisting in localStorage)
export type ChainName = typeof MAINNET_CHAIN_NAME | typeof TESTNET_CHAIN_NAME

const chainNameAtom = atom<ChainName>((localStorage.getItem('chain-name') as ChainName) ?? MAINNET_CHAIN_NAME)
export const chainNameAtomRef = atom(
  (get) => get(chainNameAtom),
  (_, set, { chainName }: { chainName: ChainName }) => {
    set(chainNameAtom, chainName)
    localStorage.setItem('chain-name', chainName)
  }
)

// balanceAtom
export const balanceAtom = atom(undefined)
