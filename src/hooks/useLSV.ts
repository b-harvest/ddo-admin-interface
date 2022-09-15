import BigNumber from 'bignumber.js'
import { VoteOptions } from 'constants/lsv'
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

function getVoteOptionEnum(option: number): VoteOptions | undefined {
  switch (option) {
    case 1:
      return VoteOptions.YES
    case 2:
      return VoteOptions.ABSTAIN
    case 3:
      return VoteOptions.NO
    case 4:
      return VoteOptions.VETO
    default:
      return undefined
  }
}

const useLSV = () => {
  // isBlocksLCDDataLoading
  const { blocksCommitTime } = useLSVBlockProposing()

  const { data: allLSVData, isLoading: allLSVDataLoading, mutate: mutateAllLSVData } = useAllLSV()
  const { data: allLSVVoteData, isLoading: allLSVVoteDataLoading, mutate: mutateAllLSVVoteData } = useAllLSVVote()

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
          const option = getVoteOptionEnum(v.vote.option) ?? VoteOptions.DIDNOT
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
        const lastProposingBlock = blocksCommitTime.find(
          (bp) => bp.valHexAddr.toUpperCase() === item.valHexAddr.toUpperCase()
        )

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

  // isBlocksLCDDataLoading
  const isLoading = useMemo<boolean>(
    () => allLSVDataLoading || allLSVVoteDataLoading,
    [allLSVDataLoading, allLSVVoteDataLoading]
  )

  const mutateAllLSV = useCallback(() => {
    mutateAllLSVData()
    mutateAllLSVVoteData()
  }, [mutateAllLSVData, mutateAllLSVVoteData])

  return { allLSVTimestamp, allLSVVoteTimestamp, allLSVVote, allLSV, findLSVByAddr, isLoading, mutateAllLSV }
}

export default useLSV
