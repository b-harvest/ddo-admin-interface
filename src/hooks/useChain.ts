import { CHAIN_IDS } from 'constants/chain'
import { useAtom } from 'jotai'
import { useCallback, useMemo } from 'react'
import { allChainInfoAtomRef, allChainLiveAtomRef, chainIdAtomRef, latestBlockLCDAtomRef } from 'state/atoms'
import { Chain } from 'types/chain'

const useChain = () => {
  const [chainIdAtom] = useAtom(chainIdAtomRef)
  const [allChainLiveAtom] = useAtom(allChainLiveAtomRef)
  const [allChainInfoAtom] = useAtom(allChainInfoAtomRef)
  const [latestBlockLCDAtom] = useAtom(latestBlockLCDAtomRef)

  const allChain = useMemo(() => {
    return (
      (allChainInfoAtom.map((chainInfo) => {
        return {
          ...chainInfo,
          live: allChainLiveAtom.find((item) => item.chainId === chainInfo.chainId),
        }
      }) as Chain[]) ?? []
    )
  }, [allChainInfoAtom, allChainLiveAtom])

  const findChainById = useCallback(
    (chainId: CHAIN_IDS) => {
      return allChain.find((item) => item.chainId === chainId)
    },
    [allChain]
  )

  const backendBlockHeight = useMemo(() => {
    const backendBlockHeightRaw = findChainById(chainIdAtom)?.live?.height
    const backendBlockHeight = backendBlockHeightRaw ?? '-'

    return backendBlockHeight
  }, [chainIdAtom, findChainById])

  const onchainBlockHeight = useMemo(() => {
    const onchainBlockHeightRaw = latestBlockLCDAtom?.block.header.height
    const onchainBlockHeight = onchainBlockHeightRaw ?? '-'

    return onchainBlockHeight
  }, [latestBlockLCDAtom])

  return { backendBlockHeight, onchainBlockHeight, allChain, findChainById }
}

export default useChain
