// import { CHAIN_IDS } from 'constants/chain'
// import {
//   useAllAssetInfo,
//   useAllAssetLive,
//   useAllChainInfo,
//   useAllChainLive,
//   useAllPairInfo,
//   useAllPairLive,
// } from 'data/useAPI'
// import { useAtom } from 'jotai'
// import { useEffect } from 'react'
// import {
//   allAssetInfoAtomRef,
//   allAssetLiveAtomRef,
//   allChainInfoAtomRef,
//   allChainLiveAtomRef,
//   allPairInfoAtomRef,
//   allPairLiveAtomRef,
//   chainIdAtomRef,
//   isTestnetAtomRef,
// } from 'state/atoms'
// import type { APIHookReturn } from 'types/api'
// import type { AssetInfo, AssetLive } from 'types/asset'
// import type { ChainInfo, ChainLive } from 'types/chain'
// import type { PairInfo, PairLive } from 'types/pair'

// export default function StateUpdater(): null {
//   // chain id
//   const [chainIdAtom] = useAtom(chainIdAtomRef)
//   const [, setIsTestnetAtom] = useAtom(isTestnetAtomRef)

//   useEffect(() => {
//     setIsTestnetAtom(chainIdAtom === CHAIN_IDS.MOONCAT)
//     console.log('chainIdAtom', chainIdAtom)
//   }, [chainIdAtom, setIsTestnetAtom])

//   // all chain
//   const [, setAllChainInfoAtom] = useAtom(allChainInfoAtomRef)
//   const [, setAllChainLiveAtom] = useAtom(allChainLiveAtomRef)

//   const { data: allChainInfoData, isLoading: allChainInfoIsLoading }: APIHookReturn<ChainInfo[]> = useAllChainInfo(0) // to be 6000
//   const { data: allChainLiveData, isLoading: allChainLiveIsLoading }: APIHookReturn<ChainLive[]> = useAllChainLive(0) // to be 6000

//   useEffect(() => {
//     if (allChainInfoData && allChainLiveData) {
//       const allChainInfo = allChainInfoData?.data ?? []
//       setAllChainInfoAtom(allChainInfo)
//       console.log('allChainInfo', allChainInfoData)

//       const allChainLive = allChainLiveData?.data ?? []
//       setAllChainLiveAtom(allChainLive)
//       console.log('allChainLive', allChainLiveData)
//     }
//   }, [allChainInfoData, setAllChainInfoAtom, allChainLiveData, setAllChainLiveAtom])

//   // all asset
//   const [, setAllAssetInfoAtom] = useAtom(allAssetInfoAtomRef)
//   const [, setAllAssetLiveAtom] = useAtom(allAssetLiveAtomRef)

//   const { data: allAssetInfoData, isLoading: allAssetInfoIsLoading }: APIHookReturn<AssetInfo[]> = useAllAssetInfo(0) // to be 6000
//   const { data: allAssetLiveData, isLoading: allAssetLiveIsLoading }: APIHookReturn<AssetLive[]> = useAllAssetLive(0) // to be 6000

//   useEffect(() => {
//     if (allAssetInfoData && allAssetLiveData) {
//       const allAssetInfo = allAssetInfoData.data ?? []
//       setAllAssetInfoAtom(allAssetInfo)
//       console.log('allAssetInfo', allAssetInfoData)

//       const allAssetLive = allAssetLiveData.data ?? []
//       setAllAssetLiveAtom(allAssetLive)
//       console.log('allAssetLive', allAssetLiveData)
//     }
//   }, [allAssetInfoData, setAllAssetInfoAtom, allAssetLiveData, setAllAssetLiveAtom])

//   // all pair
//   const [, setAllPairtInfoAtom] = useAtom(allPairInfoAtomRef)
//   const [, setAllPairLiveAtom] = useAtom(allPairLiveAtomRef)

//   const { data: allPairInfoData, isLoading: allPairInfoIsLoading }: APIHookReturn<PairInfo[]> = useAllPairInfo(0) // to be 6000
//   const { data: allPairLiveData, isLoading: allPairLiveIsLoading }: APIHookReturn<PairLive[]> = useAllPairLive(0) // to be 6000

//   useEffect(() => {
//     if (allPairInfoData && allPairLiveData) {
//       const allPairInfo = allPairInfoData.data ?? []
//       setAllPairtInfoAtom(allPairInfo)
//       console.log('allPairInfo', allPairInfoData)

//       const allPairLive = allPairLiveData.data ?? []
//       setAllPairLiveAtom(allPairLive)
//       console.log('allPairLive', allPairLiveData)
//     }
//   }, [allPairInfoData, setAllPairtInfoAtom, allPairLiveData, setAllPairLiveAtom])

//   return null
// }

export {}
