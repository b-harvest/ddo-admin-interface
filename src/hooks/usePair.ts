import { useAtom } from 'jotai'
import { useCallback } from 'react'
import { allPairInfoAtomRef, allPairLiveAtomRef } from 'state/atoms'

const useAsset = () => {
  const [allPairInfoAtom] = useAtom(allPairInfoAtomRef)
  const [allPairLiveAtom] = useAtom(allPairLiveAtomRef)

  const getTvlbyDenom = useCallback(
    (denom: string) => {
      return denom
    },
    [allPairInfoAtom]
  )

  return { allPairInfoAtom, allPairLiveAtom }
}

export default useAsset
