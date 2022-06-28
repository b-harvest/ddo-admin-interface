import { useAllAssetInfo, useAllBalance } from 'hooks/useAPI'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { chainNameAtomRef } from 'state/atoms'
import type { Balance } from 'types/account'
import type { APIHookReturn } from 'types/api'
import type { AssetInfo } from 'types/asset'

export default function StateUpdater(): null {
  const [chainNameAtom] = useAtom(chainNameAtomRef)

  const {
    data: allAssetInfoData,
    isError: allAssetInfoIsError,
    isLoading: allAssetInfoIsLoading,
  }: APIHookReturn<AssetInfo[]> = useAllAssetInfo()

  // will be moved to account page
  const {
    data: allBalanceData,
    isError: allBalanceIsError,
    isLoading: allBalanceIsLoading,
  }: APIHookReturn<Balance> = useAllBalance('cre1pc2xjkz28r9744a5d7u3ddqhsw3a9hrf7acccz')

  useEffect(() => {
    // the below is tmp for test using swr and jotai
    console.log('chainNameAtom', chainNameAtom)
    if (allBalanceIsLoading) {
      console.log('useAllBalance - is loading')
    } else {
      console.log('useAllBalance', allBalanceData, allBalanceIsError)
      console.log('useAllAssetInfo', allAssetInfoData, allAssetInfoIsError, allAssetInfoIsLoading)
    }
  }, [chainNameAtom, allBalanceIsLoading])

  return null
}
