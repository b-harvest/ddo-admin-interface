import BigNumber from 'bignumber.js'
import { CHAIN_IDS } from 'constants/chain'
import { useAllChainInfo } from 'data/useAPI'
import { useAllChainLive } from 'data/useAPI'
import { useLatestBlockLCD } from 'data/useLCD'
import { useAtom } from 'jotai'
import { useCallback, useMemo } from 'react'
import { chainIdAtomRef } from 'state/atoms'
import type { APIHookReturn, LCDHookReturn } from 'types/api'
import type { BlockLCD } from 'types/block'
import type { ChainInfo } from 'types/chain'
import type { ChainLive } from 'types/chain'
// import { allChainInfoAtomRef, allChainLiveAtomRef } from 'state/atoms'
import { Chain } from 'types/chain'

const useChain = ({ interval = 0 }: { interval?: number }) => {
  // chainId atom
  const [chainIdAtom] = useAtom(chainIdAtomRef)

  const { data: latestBlockLCDData }: LCDHookReturn<BlockLCD> = useLatestBlockLCD({}, interval)
  const { data: allChainInfoData, isLoading: allChainInfoIsLoading }: APIHookReturn<ChainInfo[]> =
    useAllChainInfo(interval) // to be 6000
  const { data: allChainLiveData, isLoading: allChainLiveIsLoading }: APIHookReturn<ChainLive[]> =
    useAllChainLive(interval)

  console.log('latestBlockLCDData', latestBlockLCDData)
  console.log('allChainInfoData', allChainInfoData)
  console.log('allChainLiveData', allChainLiveData)

  const allChain = useMemo(() => {
    return (
      (allChainInfoData?.data.map((chainInfo) => {
        return {
          ...chainInfo,
          live: allChainLiveData?.data.find((item) => item.chainId === chainInfo.chainId),
        }
      }) as Chain[]) ?? []
    )
  }, [allChainInfoData, allChainLiveData])

  const findChainById = useCallback(
    (chainId: CHAIN_IDS) => {
      return allChain.find((item) => item.chainId === chainId)
    },
    [allChain]
  )

  const backendBlockHeight = useMemo(() => {
    const backendBlockHeightRaw = findChainById(chainIdAtom)?.live?.height
    const backendBlockHeight = backendBlockHeightRaw ? new BigNumber(backendBlockHeightRaw).toFormat() : 'NA'

    return backendBlockHeight
  }, [chainIdAtom, findChainById])

  const onchainBlockHeight = useMemo(() => {
    const onchainBlockHeightRaw = latestBlockLCDData?.block.header.height
    const onchainBlockHeight = onchainBlockHeightRaw ? new BigNumber(onchainBlockHeightRaw).toFormat() : 'NA'

    return onchainBlockHeight
  }, [latestBlockLCDData])

  return { backendBlockHeight, onchainBlockHeight, allChain, findChainById }
}

export default useChain
