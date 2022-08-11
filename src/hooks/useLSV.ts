import BigNumber from 'bignumber.js'
import { useAllLSV, useAllLSVVote } from 'data/useAPI'
import useLSVBlockProposing from 'hooks/useLSVBlockProposing'
import { useCallback, useMemo } from 'react'
import type { LSV, LSVVote } from 'types/lsv'

function getVoteAlias(option: number): string {
  switch (option) {
    case 1:
      return 'Yes'
    case 2:
      return 'No'
    case 3:
      return 'No w/ veto'
    case 4:
      return 'Abstain'
    case 5:
      return 'Did not'
    default:
      return '-'
  }
}

const useLSV = () => {
  const { blocksCommitTime, isBlocksLCDDataLoading } = useLSVBlockProposing()

  const { data: allLSVData, isLoading: allLSVDataLoading } = useAllLSV()
  const { data: allLSVVoteData, isLoading: allLSVVoteDataLoading } = useAllLSVVote()

  const allLSVTimestamp = useMemo<number | undefined>(
    () => (allLSVData?.syncTimestamp ? allLSVData.syncTimestamp * 1000 : undefined),
    [allLSVData]
  )

  const allLSVVoteTimestamp = useMemo<number | undefined>(
    () => (allLSVVoteData ? allLSVVoteData.curTimestamp * 1000 : undefined),
    [allLSVVoteData]
  )

  const allLSVVote = useMemo<LSVVote[]>(() => {
    return (
      allLSVVoteData?.data.map((item) => {
        const votes = item.votes.map((v) => {
          const option = v.vote.option
          const optionAlias = getVoteAlias(v.vote.option)
          const weight = Number(v.vote.weight)
          return { ...v, vote: { ...v.vote, option, optionAlias, weight } }
        })

        return { ...item, votes }
      }) ?? []
    )
  }, [allLSVVoteData])

  const allLSV = useMemo<LSV[]>(
    () =>
      allLSVData?.data.map((item) => {
        const lsvStartTimestamp = item.lsvStartTimestamp * 1000
        const tokens = new BigNumber(item.tokens).div(10 ** 6) // exponent wip
        const commission = Number(item.commission) * 100
        const jailed = item.jailUntilTimestamp !== 0

        // block commit time
        const lastProposingBlock = blocksCommitTime.find((bp) => bp.valHexAddr === item.valHexAddr)

        // vote
        const voteData = allLSVVote.find((lsv) => lsv.addr === item.addr)
        const votingRate = voteData ? (voteData.voteCnt / voteData.mustVoteCnt) * 100 : 0

        return {
          ...item,
          lsvStartTimestamp,
          tokens,
          commission,
          jailed,
          immediateKickout: jailed || commission > 20,
          voteData,
          votingRate,
          lastProposingBlock,
        }
      }) ?? [],
    [allLSVData, allLSVVote, blocksCommitTime]
  )

  const findLSVByAddr = useCallback(
    (valOperAddr: string) => allLSV.find((item) => item.valOperAddr === valOperAddr),
    [allLSV]
  )

  const isLoading = useMemo<boolean>(
    () => isBlocksLCDDataLoading || allLSVDataLoading || allLSVVoteDataLoading,
    [isBlocksLCDDataLoading, allLSVDataLoading, allLSVVoteDataLoading]
  )

  return { allLSVTimestamp, allLSVVoteTimestamp, allLSVVote, allLSV, findLSVByAddr, isLoading }
}

export default useLSV
