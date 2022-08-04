import BigNumber from 'bignumber.js'
import { useAllLSV, useAllLSVVote } from 'data/useAPI'
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
    default:
      return '-'
  }
}

const useLSV = () => {
  const { data: allLSVData } = useAllLSV()
  const { data: allLSVVoteData } = useAllLSVVote()

  const allLSVTimestamp = useMemo<number | undefined>(
    () => (allLSVData ? allLSVData.curTimestamp * 1000 : undefined),
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
          const optionAlias = getVoteAlias(v.vote.option)
          const weight = Number(v.vote.weight)
          return { ...v, vote: { ...v.vote, optionAlias, weight } }
        })

        return { ...item, votes }
      }) ?? []
    )
  }, [allLSVVoteData])

  const allLSV = useMemo<LSV[]>(
    () =>
      allLSVData?.data.map((item) => {
        const lsvStartTimestamp = item.lsvStartTimestamp * 1000
        const tokens = new BigNumber(item.tokens) // exponent wip
        const commission = Number(item.commission) * 100
        const jailed = item.jailUntilTimestamp !== 0

        // vote
        const voteData = allLSVVote.find((lsv) => lsv.addr === item.addr)
        const votingRatio = voteData ? (voteData.voteCnt / voteData.mustVoteCnt) * 100 : 0

        return {
          ...item,
          lsvStartTimestamp,
          tokens,
          commission,
          jailed,
          immediateKickout: jailed || commission > 20,
          voteData,
          votingRatio,
        }
      }) ?? [],
    [allLSVData, allLSVVote]
  )

  const findLSVByAddr = useCallback(
    (valOperAddr: string) => allLSV.find((item) => item.valOperAddr === valOperAddr),
    [allLSV]
  )

  return { allLSVTimestamp, allLSVVoteTimestamp, allLSVVote, allLSV, findLSVByAddr }
}

export default useLSV
