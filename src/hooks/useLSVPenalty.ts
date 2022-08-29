import { PENALTY_STATUS } from 'constants/lsv'
import { LSV_VOTE_WARN_REFERENCE_SEPERATOR } from 'constants/msg'
import { usePenaltiesByLSV } from 'data/useAPI'
import { useCallback, useMemo } from 'react'
import { LSVEventType, LSVEventVoteWarn, Penalty, VotePenalty } from 'types/lsv'

const useLSVPenalty = (address: string) => {
  const { data, isLoading, mutate } = usePenaltiesByLSV({ address })

  const allPenalties = useMemo<Penalty[]>(
    () =>
      data?.data.map((item) => {
        const isWarning = ['vote_warning', 'reliabiity_warning'].includes(item.event)
        const status = isWarning
          ? item.confirmId
            ? PENALTY_STATUS.WarningConfirmed
            : PENALTY_STATUS.Warned
          : item.confirmId
          ? PENALTY_STATUS.PenaltyConfirmed
          : PENALTY_STATUS.Penalty

        return {
          ...item,
          status,
          height: item.height ? item.height : undefined,
          regId: item.regId !== 'n' ? item.regId : undefined,
          confirmId: item.confirmId !== 'n' ? item.confirmId : undefined,
          timestamp: item.timestamp * 1000,
          confirmTimestamp: Number(item.confirmTimestamp) * 1000,
        }
      }) ?? [],
    [data]
  )

  const getLSVEvents = useCallback(
    (event: LSVEventType | LSVEventType[]) => {
      const filters = Array.isArray(event) ? event : [event]
      return allPenalties.filter((item) => filters.includes(item.event))
    },
    [allPenalties]
  )

  // vote penalty
  const votePenalties = useMemo<VotePenalty[]>(() => {
    const voteWarnedList = getLSVEvents('vote_warning')
    const votePenaltyList = getLSVEvents('vote_penalty')

    return (voteWarnedList.concat(votePenaltyList) as LSVEventVoteWarn[]).map((item) => {
      const descs = item.rawJson.desc?.split(LSV_VOTE_WARN_REFERENCE_SEPERATOR)
      const refLink = descs && descs.length === 2 ? descs[0] : undefined
      const desc = descs && descs.length === 2 ? descs[1] : descs ? descs[0] : undefined
      const posterId = item.confirmId ?? item.regId
      const postTimestamp = item.confirmId ? item.confirmTimestamp : item.timestamp
      return {
        ...item,
        refLink,
        desc,
        posterId,
        postTimestamp,
      }
    })
  }, [getLSVEvents])

  const getVotePenaltiesByProposal = useCallback(
    (proposalId: number) => votePenalties.filter((item) => item.rawJson?.proposalId === proposalId),
    [votePenalties]
  )

  const getRepVotePenaltyByProposal = useCallback(
    (proposalId: number) => {
      const penalties = getVotePenaltiesByProposal(proposalId)

      const penaltyConfirmed = penalties.find((item) => item.status === PENALTY_STATUS.PenaltyConfirmed)
      if (penaltyConfirmed) return penaltyConfirmed

      const penaltyPosted = penalties.find((item) => item.status === PENALTY_STATUS.Penalty)
      if (penaltyPosted) return penaltyPosted

      const warningConfirmed = penalties.find((item) => item.status === PENALTY_STATUS.WarningConfirmed)
      if (warningConfirmed) return warningConfirmed

      const warningPosted = penalties.find((item) => item.status === PENALTY_STATUS.Warned)
      if (warningPosted) return warningPosted

      return undefined
    },
    [getVotePenaltiesByProposal]
  )

  // to be del
  const getVotePenaltyRepStatusByProposal = useCallback(
    (proposalId: number) => {
      const repPenalty = getRepVotePenaltyByProposal(proposalId)
      return repPenalty ? repPenalty.status : PENALTY_STATUS.NotYet
    },
    [getRepVotePenaltyByProposal]
  )

  return {
    allPenalties,
    getLSVEvents,
    votePenalties,
    getVotePenaltiesByProposal,
    getRepVotePenaltyByProposal,
    getVotePenaltyRepStatusByProposal,
    isLoading,
    mutate,
  }
}

export default useLSVPenalty
