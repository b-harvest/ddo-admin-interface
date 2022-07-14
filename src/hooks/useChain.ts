import { CHAIN_IDS } from 'constants/chain'
import { useAtom } from 'jotai'
import { useCallback, useMemo } from 'react'
import { allChainInfoAtomRef, allChainLiveAtomRef } from 'state/atoms'
import { Chain } from 'types/chain'

const useChain = ({ interval = 0 }: { interval?: number }) => {
  const [allChainLiveAtom] = useAtom(allChainLiveAtomRef)
  const [allChainInfoAtom] = useAtom(allChainInfoAtomRef)

  const allChain = useMemo(() => {
    return allChainInfoAtom.map((chainInfo) => {
      return {
        ...chainInfo,
        live: allChainLiveAtom.find((item) => item.chainId === chainInfo.chainId),
      }
    }) as Chain[]
  }, [allChainInfoAtom, allChainLiveAtom])

  const findChainById = useCallback(
    (chainId: CHAIN_IDS) => {
      return allChain.find((item) => item.chainId === chainId)
    },
    [allChain]
  )

  return { allChain, findChainById }
}

export default useChain
