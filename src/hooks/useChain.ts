import BigNumber from 'bignumber.js'
import { CHAIN_IDS } from 'constants/chain'
import { useBlockLCD } from 'data/useLCD'
import dayjs from 'dayjs'
import { useAtom } from 'jotai'
import { useCallback, useMemo } from 'react'
import { allChainInfoAtomRef, allChainLiveAtomRef, chainIdAtomRef, latestBlockLCDAtomRef } from 'state/atoms'
import type { LCDHookReturn } from 'types/api'
import type { BlockLCD } from 'types/chain'
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
    return findChainById(chainIdAtom)?.live?.height
  }, [chainIdAtom, findChainById])

  const onchainBlockHeight = useMemo(() => {
    return latestBlockLCDAtom?.block.header.height
  }, [latestBlockLCDAtom])

  const { data: lastBlockLCDData }: LCDHookReturn<BlockLCD> = useBlockLCD({
    height: getLastBlockHeightOf(backendBlockHeight),
    fetch: backendBlockHeight !== undefined,
  })

  const blockCreationTime = useMemo(() => {
    const latestTime = latestBlockLCDAtom?.block.header.time
    const lastTime = lastBlockLCDData?.block.header.time

    if (!latestTime || !lastTime) return 0
    return dayjs(latestTime).diff(dayjs(lastTime), 'ms') // truncate false by default
  }, [latestBlockLCDAtom, lastBlockLCDData])

  return { backendBlockHeight, onchainBlockHeight, allChain, findChainById, blockCreationTime }
}

export default useChain

function getLastBlockHeightOf(height?: string) {
  return height ? new BigNumber(height).minus(1).toString() : '0'
}
