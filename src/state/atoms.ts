import { atom } from 'jotai'

// chainNameAtom (persisting in localStorage)
export type ChainName = 'mainnet' | 'testnet'

const chainNameAtom = atom<string>(localStorage.getItem('chain-name') ?? 'mainnet')
export const chainNameAtomRef = atom(
  (get) => get(chainNameAtom),
  (_, set, { chainName }: { chainName: ChainName }) => {
    set(chainNameAtom, chainName)
    localStorage.setItem('chain-name', chainName)
  }
)

// balanceAtom
export const balanceAtom = atom(undefined)
