import { COMMON_FETCHING_INTERVAL } from 'constants/chain'
import {
  useAllAssetInfo,
  useAllAssetLive,
  useAllChainInfo,
  useAllChainLive,
  useAllPairInfo,
  useAllPairLive,
  useAllPoolLive,
  useFetchAllLiquidFarmLive,
} from 'data/useAPI'
import { useBlockLCD } from 'data/useLCD'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import {
  allAssetInfoAtomRef,
  allAssetLiveAtomRef,
  allChainInfoAtomRef,
  allChainLiveAtomRef,
  allLiquidFarmLiveAtomRef,
  allPairInfoAtomRef,
  allPairLiveAtomRef,
  allPoolLiveAtomRef,
  latestBlockLCDAtomRef,
} from 'state/atoms'
import type { APIHookReturn, LCDHookReturn } from 'types/api'
import type { AssetInfoRaw, AssetLiveRaw } from 'types/asset'
import type { BlockLCD, ChainInfo, ChainLive } from 'types/chain'
import { LiquidFarmLiveRaw } from 'types/liquidFarm'
import type { PairInfoRaw, PairLiveRaw } from 'types/pair'
import type { PoolLiveRaw } from 'types/pool'

export default function StateUpdater(): null {
  // all chain
  const [, setAllChainInfoAtom] = useAtom(allChainInfoAtomRef)
  const [, setAllChainLiveAtom] = useAtom(allChainLiveAtomRef)
  const [, setLatestBlockLCDAtom] = useAtom(latestBlockLCDAtomRef)

  const { data: allChainInfoData }: APIHookReturn<ChainInfo[]> = useAllChainInfo(COMMON_FETCHING_INTERVAL)
  const { data: allChainLiveData }: APIHookReturn<ChainLive[]> = useAllChainLive(COMMON_FETCHING_INTERVAL)
  const { data: latestBlockLCDData }: LCDHookReturn<BlockLCD> = useBlockLCD({}, COMMON_FETCHING_INTERVAL)

  // all asset
  const [, setAllAssetInfoAtom] = useAtom(allAssetInfoAtomRef)
  const [, setAllAssetLiveAtom] = useAtom(allAssetLiveAtomRef)

  const { data: allAssetInfoData, isLoading: allAssetInfoIsLoading }: APIHookReturn<AssetInfoRaw[]> =
    useAllAssetInfo(COMMON_FETCHING_INTERVAL)
  const { data: allAssetLiveData, isLoading: allAssetLiveIsLoading }: APIHookReturn<AssetLiveRaw[]> =
    useAllAssetLive(COMMON_FETCHING_INTERVAL)

  // all pair
  const [, setAllPairtInfoAtom] = useAtom(allPairInfoAtomRef)
  const [, setAllPairLiveAtom] = useAtom(allPairLiveAtomRef)

  const { data: allPairInfoData, isLoading: allPairInfoIsLoading }: APIHookReturn<PairInfoRaw[]> =
    useAllPairInfo(COMMON_FETCHING_INTERVAL)
  const { data: allPairLiveData, isLoading: allPairLiveIsLoading }: APIHookReturn<PairLiveRaw[]> =
    useAllPairLive(COMMON_FETCHING_INTERVAL)

  // all pool
  const [, setAllPoolLiveAtom] = useAtom(allPoolLiveAtomRef)
  const { data: allPoolLiveData, isLoading: allPoolLiveIsLoading }: APIHookReturn<PoolLiveRaw[]> =
    useAllPoolLive(COMMON_FETCHING_INTERVAL)

  /** all liquidfarm live */
  const [, setAllLiquidFarmLiveAtom] = useAtom(allLiquidFarmLiveAtomRef)
  const { data: allLiquidFarmLiveData }: APIHookReturn<LiquidFarmLiveRaw[]> =
    useFetchAllLiquidFarmLive(COMMON_FETCHING_INTERVAL)

  useEffect(() => {
    if (allLiquidFarmLiveData) setAllLiquidFarmLiveAtom(allLiquidFarmLiveData.data ?? [])
  }, [allLiquidFarmLiveData, setAllLiquidFarmLiveAtom])

  useEffect(() => {
    if (allChainInfoData && allChainLiveData) {
      const allChainInfo = allChainInfoData.data ?? []
      setAllChainInfoAtom(allChainInfo)

      const allChainLive = allChainLiveData.data ?? []
      setAllChainLiveAtom(allChainLive)
    }

    if (latestBlockLCDData) {
      setLatestBlockLCDAtom(latestBlockLCDData)
    }

    if (allAssetInfoData && allAssetLiveData) {
      const allAssetInfo = allAssetInfoData.data ?? []
      setAllAssetInfoAtom(allAssetInfo)
      // console.log('allAssetInfo', allAssetInfoData)

      const allAssetLive = allAssetLiveData.data ?? []
      setAllAssetLiveAtom(allAssetLive)
      // console.log('allAssetLive', allAssetLiveData)
    }

    if (allPairInfoData && allPairLiveData) {
      const allPairInfo = allPairInfoData.data ?? []
      setAllPairtInfoAtom(allPairInfo)
      // console.log('allPairInfo', allPairInfoData)

      const allPairLive = allPairLiveData.data ?? []
      setAllPairLiveAtom(allPairLive)
      // console.log('allPairLive', allPairLiveData)
    }

    if (allPoolLiveData) {
      const allPoolLive = allPoolLiveData.data ?? []
      setAllPoolLiveAtom(allPoolLive)
      // console.log('allPoolLive', allPoolLiveData)
    }
  }, [
    allChainInfoData,
    setAllChainInfoAtom,
    allChainLiveData,
    setAllChainLiveAtom,
    latestBlockLCDData,
    setLatestBlockLCDAtom,
    allAssetInfoData,
    setAllAssetInfoAtom,
    allAssetLiveData,
    setAllAssetLiveAtom,
    allPairInfoData,
    setAllPairtInfoAtom,
    allPairLiveData,
    setAllPairLiveAtom,
    allPoolLiveData,
    setAllPoolLiveAtom,
  ])

  return null
}
