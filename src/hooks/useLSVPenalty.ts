import { VOTE_WARNING_STATUS } from 'constants/lsv'
import { LSV_VOTE_WARN_REFERENCE_SEPERATOR } from 'constants/msg'
import { usePenaltiesByLSV } from 'data/useAPI'
import { useCallback, useMemo } from 'react'
import { LSVEventType, LSVEventVoteWarn, VotePenalty } from 'types/lsv'

const useLSVPenalty = (address: string) => {
  const { data, isLoading } = usePenaltiesByLSV({ address })

  const getLSVEvents = useCallback(
    (event: LSVEventType) => {
      const events = data?.data.filter((item) => item.event === event)
      return (
        events?.map((item) => ({
          ...item,
          height: item.height ? item.height : undefined,
          regId: item.regId !== 'n' ? item.regId : undefined,
          confirmId: item.confirmId !== 'n' ? item.confirmId : undefined,
          timestamp: item.timestamp * 1000,
          confirmTimestamp: Number(item.confirmTimestamp) * 1000,
        })) ?? []
      )
    },
    [data]
  )

  // vote penalty
  const votePenalties = useMemo<VotePenalty[]>(() => {
    const voteWarnedList = getLSVEvents('vote_warning').map((item) => ({
      ...item,
      status: item.confirmId ? VOTE_WARNING_STATUS.WarningConfirmed : VOTE_WARNING_STATUS.Warned,
    }))
    const votePenaltyList = getLSVEvents('vote_penalty').map((item) => ({
      ...item,
      status: item.confirmId ? VOTE_WARNING_STATUS.PenaltyConfirmed : VOTE_WARNING_STATUS.Penalty,
    }))

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

      const penaltyConfirmed = penalties.find((item) => item.status === VOTE_WARNING_STATUS.PenaltyConfirmed)
      if (penaltyConfirmed) return penaltyConfirmed

      const penaltyPosted = penalties.find((item) => item.status === VOTE_WARNING_STATUS.Penalty)
      if (penaltyPosted) return penaltyPosted

      const warningConfirmed = penalties.find((item) => item.status === VOTE_WARNING_STATUS.WarningConfirmed)
      if (warningConfirmed) return warningConfirmed

      const warningPosted = penalties.find((item) => item.status === VOTE_WARNING_STATUS.Warned)
      if (warningPosted) return warningPosted

      return undefined
    },
    [getVotePenaltiesByProposal]
  )

  // to be del
  const getVotePenaltyRepStatusByProposal = useCallback(
    (proposalId: number) => {
      const repPenalty = getRepVotePenaltyByProposal(proposalId)
      return repPenalty ? repPenalty.status : VOTE_WARNING_STATUS.NotYet
    },
    [getRepVotePenaltyByProposal]
  )

  return {
    getLSVEvents,
    votePenalties,
    getVotePenaltiesByProposal,
    getRepVotePenaltyByProposal,
    getVotePenaltyRepStatusByProposal,
    isLoading,
  }
}

export default useLSVPenalty
