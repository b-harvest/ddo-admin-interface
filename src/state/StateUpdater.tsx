import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { chainNameAtomRef } from 'state/atoms'

export default function StateUpdater(): null {
  const [chainNameAtom] = useAtom(chainNameAtomRef)

  useEffect(() => {
    // the below is tmp for test using swr and jotai
    console.log('chainNameAtom', chainNameAtom)
  }, [chainNameAtom])

  return null
}
