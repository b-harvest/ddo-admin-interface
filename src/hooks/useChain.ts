import { useAtom } from 'jotai'
import { useMemo } from 'react'
import { allChainInfoAtomRef, allChainLiveAtomRef } from 'state/atoms'
import { Asset } from 'types/asset'

const useAsset = () => {
  const [allChainLiveAtom] = useAtom(allChainLiveAtomRef)
  const [allChainInfoAtom] = useAtom(allChainInfoAtomRef)

  const allChain = useMemo(() => {
    return allChainInfoAtom.map((chainInfo) => {
      return {
        ...chainInfo,
        live: allChainLiveAtom.find((item) => item.chainId === chainInfo.chainId),
      }
    }) as Asset[]
  }, [allChainInfoAtom, allChainLiveAtom])

  return { allChain }
}

export default useAsset
