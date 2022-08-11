import { useBlockLCD } from 'data/useLCD'
import { useAtom } from 'jotai'
import { useMemo } from 'react'
import { latestBlockLCDAtomRef } from 'state/atoms'
import type { BlockLCD } from 'types/block'
import type { BlockProposingLSV } from 'types/lsv'

const useLSVBlockProposing = () => {
  const [latestBlockLCDAtom] = useAtom(latestBlockLCDAtomRef)

  const latestHeight = useMemo<number | undefined>(() => {
    return latestBlockLCDAtom?.block.header.height ? Number(latestBlockLCDAtom.block.header.height) : undefined
  }, [latestBlockLCDAtom])

  const { data: prev1BlockLCDData, isLoading: prev1BlockLCDDataLoading } = useBlockLCD({
    height: latestHeight ? (latestHeight - 1).toString() : '',
    fetch: latestBlockLCDAtom !== undefined,
  })

  const { data: prev2BlockLCDData, isLoading: prev2BlockLCDDataLoading } = useBlockLCD({
    height: latestHeight ? (latestHeight - 2).toString() : '',
    fetch: latestBlockLCDAtom !== undefined,
  })

  const { data: prev3BlockLCDData, isLoading: prev3BlockLCDDataLoading } = useBlockLCD({
    height: latestHeight ? (latestHeight - 3).toString() : '',
    fetch: latestBlockLCDAtom !== undefined,
  })

  const { data: prev4BlockLCDData, isLoading: prev4BlockLCDDataLoading } = useBlockLCD({
    height: latestHeight ? (latestHeight - 4).toString() : '',
    fetch: latestBlockLCDAtom !== undefined,
  })

  const { data: prev5BlockLCDData, isLoading: prev5BlockLCDDataLoading } = useBlockLCD({
    height: latestHeight ? (latestHeight - 5).toString() : '',
    fetch: latestBlockLCDAtom !== undefined,
  })

  const { data: prev6BlockLCDData, isLoading: prev6BlockLCDDataLoading } = useBlockLCD({
    height: latestHeight ? (latestHeight - 6).toString() : '',
    fetch: latestBlockLCDAtom !== undefined,
  })

  const { data: prev7BlockLCDData, isLoading: prev7BlockLCDDataLoading } = useBlockLCD({
    height: latestHeight ? (latestHeight - 7).toString() : '',
    fetch: latestBlockLCDAtom !== undefined,
  })

  const { data: prev8BlockLCDData, isLoading: prev8BlockLCDDataLoading } = useBlockLCD({
    height: latestHeight ? (latestHeight - 8).toString() : '',
    fetch: latestBlockLCDAtom !== undefined,
  })

  const { data: prev9BlockLCDData, isLoading: prev9BlockLCDDataLoading } = useBlockLCD({
    height: latestHeight ? (latestHeight - 9).toString() : '',
    fetch: latestBlockLCDAtom !== undefined,
  })

  const { data: prev10BlockLCDData, isLoading: prev10BlockLCDDataLoading } = useBlockLCD({
    height: latestHeight ? (latestHeight - 10).toString() : '',
    fetch: latestBlockLCDAtom !== undefined,
  })

  const { data: prev11BlockLCDData, isLoading: prev11BlockLCDDataLoading } = useBlockLCD({
    height: latestHeight ? (latestHeight - 11).toString() : '',
    fetch: latestBlockLCDAtom !== undefined,
  })

  const { data: prev12BlockLCDData, isLoading: prev12BlockLCDDataLoading } = useBlockLCD({
    height: latestHeight ? (latestHeight - 12).toString() : '',
    fetch: latestBlockLCDAtom !== undefined,
  })

  const { data: prev13BlockLCDData, isLoading: prev13BlockLCDDataLoading } = useBlockLCD({
    height: latestHeight ? (latestHeight - 13).toString() : '',
    fetch: latestBlockLCDAtom !== undefined,
  })

  const blocksCommitTime = useMemo<BlockProposingLSV[]>(() => {
    return [
      mapBlockProposingData(latestBlockLCDAtom, prev1BlockLCDData),
      mapBlockProposingData(prev1BlockLCDData, prev2BlockLCDData),
      mapBlockProposingData(prev2BlockLCDData, prev3BlockLCDData),
      mapBlockProposingData(prev3BlockLCDData, prev4BlockLCDData),
      mapBlockProposingData(prev4BlockLCDData, prev5BlockLCDData),
      mapBlockProposingData(prev5BlockLCDData, prev6BlockLCDData),
      mapBlockProposingData(prev6BlockLCDData, prev7BlockLCDData),
      mapBlockProposingData(prev7BlockLCDData, prev8BlockLCDData),
      mapBlockProposingData(prev8BlockLCDData, prev9BlockLCDData),
      mapBlockProposingData(prev9BlockLCDData, prev10BlockLCDData),
      mapBlockProposingData(prev10BlockLCDData, prev11BlockLCDData),
      mapBlockProposingData(prev11BlockLCDData, prev12BlockLCDData),
      mapBlockProposingData(prev12BlockLCDData, prev13BlockLCDData),
    ].filter(isBlockProposingLSV)
  }, [
    latestBlockLCDAtom,
    prev1BlockLCDData,
    prev2BlockLCDData,
    prev3BlockLCDData,
    prev4BlockLCDData,
    prev5BlockLCDData,
    prev6BlockLCDData,
    prev7BlockLCDData,
    prev8BlockLCDData,
    prev9BlockLCDData,
    prev10BlockLCDData,
    prev11BlockLCDData,
    prev12BlockLCDData,
    prev13BlockLCDData,
  ])

  const isBlocksLCDDataLoading = useMemo<boolean>(
    () =>
      prev1BlockLCDDataLoading ||
      prev2BlockLCDDataLoading ||
      prev3BlockLCDDataLoading ||
      prev4BlockLCDDataLoading ||
      prev5BlockLCDDataLoading ||
      prev6BlockLCDDataLoading ||
      prev7BlockLCDDataLoading ||
      prev8BlockLCDDataLoading ||
      prev9BlockLCDDataLoading ||
      prev10BlockLCDDataLoading ||
      prev11BlockLCDDataLoading ||
      prev12BlockLCDDataLoading ||
      prev13BlockLCDDataLoading,
    [
      prev1BlockLCDDataLoading,
      prev2BlockLCDDataLoading,
      prev3BlockLCDDataLoading,
      prev4BlockLCDDataLoading,
      prev5BlockLCDDataLoading,
      prev6BlockLCDDataLoading,
      prev7BlockLCDDataLoading,
      prev8BlockLCDDataLoading,
      prev9BlockLCDDataLoading,
      prev10BlockLCDDataLoading,
      prev11BlockLCDDataLoading,
      prev12BlockLCDDataLoading,
      prev13BlockLCDDataLoading,
    ]
  )

  return { blocksCommitTime, isBlocksLCDDataLoading }
}

export default useLSVBlockProposing

function mapBlockProposingData(currBlockLCD?: BlockLCD, prevBlockLCD?: BlockLCD): BlockProposingLSV | undefined {
  if (!(currBlockLCD && prevBlockLCD)) return undefined

  const valHexAddr = currBlockLCD.block.header.proposer_address
  const height = currBlockLCD.block.header.height
  const time = currBlockLCD.block.header.time
  const prevBlockTime = prevBlockLCD.block.header.time
  const blockCommitTime = new Date(time).getTime() - new Date(prevBlockTime).getTime()
  return {
    valHexAddr,
    height,
    time,
    prevBlockTime,
    blockCommitTime,
  }
}

// type guard
function isBlockProposingLSV(blockProposing: BlockProposingLSV | undefined): blockProposing is BlockProposingLSV {
  return !!blockProposing
}
