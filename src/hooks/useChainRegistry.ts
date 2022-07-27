import { useCosmosBlockLCD } from 'data/useLCD'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import type { LCDHookReturn } from 'types/api'
import type { BlockLCD } from 'types/chain'
import { getLastBlockHeightOf } from 'utils/chain'
import { COSMOS_CHAIN_ID_MAP, COSMOS_CHAIN_NAME } from 'utils/chainRegistry'
import * as chainRegistry from 'utils/chainRegistry'

const useChainRegistry = (chainName: COSMOS_CHAIN_NAME) => {
  const { data: latestBlock } = useCosmosBlockLCD({ chainName })

  const asset = useMemo(() => chainRegistry.findAssetsByChain(chainName), [chainName])
  const chain = useMemo(() => chainRegistry.findChainByName(chainName), [chainName])
  const IBC = useMemo(() => chainRegistry.findIBCByChain(chainName), [chainName])

  const blockHeight = useMemo(() => {
    return latestBlock?.block.header.height
  }, [latestBlock])

  const { data: lastBlock }: LCDHookReturn<BlockLCD> = useCosmosBlockLCD({
    chainName,
    height: getLastBlockHeightOf(blockHeight),
    fetch: blockHeight !== undefined,
  })

  const blockCreationTime = useMemo(() => {
    const latestTime = latestBlock?.block.header.time
    const lastTime = lastBlock?.block.header.time

    if (!latestTime || !lastTime) return 0
    return dayjs(latestTime).diff(dayjs(lastTime), 'ms') // truncate false by default
  }, [latestBlock, lastBlock])

  const logoURI = useMemo(() => {
    const logoURIs = asset?.assets.find((item) => item.display === COSMOS_CHAIN_ID_MAP[chainName])?.logo_URIs
    return logoURIs?.png ?? logoURIs?.svg
  }, [asset, chainName])

  return { asset, chain, IBC, blockHeight, blockCreationTime, logoURI }
}

export default useChainRegistry
