import { CHAIN_IDS } from 'constants/chain'
import {
  useAllAssetInfo,
  useAllAssetLive,
  useAllChainInfo,
  useAllChainLive,
  useAllPairInfo,
  useAllPairLive,
} from 'data/useAPI'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import {
  allAssetInfoAtomRef,
  allAssetLiveAtomRef,
  allChainInfoAtomRef,
  allChainLiveAtomRef,
  allPairInfoAtomRef,
  allPairLiveAtomRef,
  chainIdAtomRef,
  isTestnetAtomRef,
} from 'state/atoms'
import type { APIHookReturn } from 'types/api'
import type { AssetInfo, AssetLive } from 'types/asset'
import type { ChainInfo, ChainLive } from 'types/chain'
import type { PairInfo, PairLive } from 'types/pair'

export default function StateUpdater(): null {
  const [chainIdAtom] = useAtom(chainIdAtomRef)
  const [, setIsTestnetAtom] = useAtom(isTestnetAtomRef)

  const [, setAllChainInfoAtom] = useAtom(allChainInfoAtomRef)
  const [, setAllChainLiveAtom] = useAtom(allChainLiveAtomRef)

  const [, setAllAssetInfoAtom] = useAtom(allAssetInfoAtomRef)
  const [, setAllAssetLiveAtom] = useAtom(allAssetLiveAtomRef)

  const [, setAllPairtInfoAtom] = useAtom(allPairInfoAtomRef)
  const [, setAllPairLiveAtom] = useAtom(allPairLiveAtomRef)

  const { data: allChainInfoData }: APIHookReturn<ChainInfo[]> = useAllChainInfo(0) // to be 6000
  const { data: allChainLiveData }: APIHookReturn<ChainLive[]> = useAllChainLive(0) // to be 6000

  const { data: allAssetInfoData }: APIHookReturn<AssetInfo[]> = useAllAssetInfo(0) // to be 6000
  const { data: allAssetLiveData }: APIHookReturn<AssetLive[]> = useAllAssetLive(0) // to be 6000

  const { data: allPairInfoData }: APIHookReturn<PairInfo[]> = useAllPairInfo(0) // to be 6000
  const { data: allPairLiveData }: APIHookReturn<PairLive[]> = useAllPairLive(0) // to be 6000

  useEffect(() => {
    setIsTestnetAtom(chainIdAtom === CHAIN_IDS.MOONCAT)
    console.log('chainIdAtom', chainIdAtom)
  }, [chainIdAtom, setIsTestnetAtom])

  useEffect(() => {
    const allChainInfo = allChainInfoData.data
    setAllChainInfoAtom(allChainInfo)
    console.log('allChainInfo', allChainInfoData)

    const allChainLive = allChainLiveData.data
    setAllChainLiveAtom(allChainLive)
    console.log('allChainLive', allChainLiveData)

    const allAssetInfo = allAssetInfoData.data
    setAllAssetInfoAtom(allAssetInfo)
    console.log('allAssetInfo', allAssetInfoData)

    const allAssetLive = allAssetLiveData.data
    setAllAssetLiveAtom(allAssetLive)
    console.log('allAssetLive', allAssetLiveData)

    const allPairInfo = allPairInfoData.data
    setAllPairtInfoAtom(allPairInfo)
    console.log('allPairInfo', allPairInfoData)

    const allPairLive = allPairLiveData.data
    setAllPairLiveAtom(allPairLive)
    console.log('allPairLive', allPairLiveData)
  }, [
    allAssetInfoData,
    setAllAssetInfoAtom,
    allAssetLiveData,
    setAllAssetLiveAtom,
    allPairInfoData,
    setAllPairtInfoAtom,
    allPairLiveData,
    setAllPairLiveAtom,
  ])

  return null
}
