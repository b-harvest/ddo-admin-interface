import { LSV_PENALTY_DATA_DESC_MAP, LSV_VOTE_WARN_REFERENCE_SEPERATOR } from 'constants/lsv'
import { usePenaltiesByLSV } from 'data/useAPI'
import { useCallback, useMemo } from 'react'
import { PENALTY_STATUS, PENALTY_TYPE } from 'types/lsv'
import { LSVEventVoteWarn, Penalty, PenaltyEvent, VotePenalty } from 'types/lsv'

const useLSVPenalty = (address: string) => {
  const { data, isLoading, mutate } = usePenaltiesByLSV({ address })

  const allPenalties = useMemo<Penalty[]>(
    () =>
      data?.data.map((item) => {
        const height = item.height ? item.height : undefined
        const regId = item.regId !== 'n' ? item.regId : undefined
        const confirmId = item.confirmId !== 'n' ? item.confirmId : undefined
        const posterId = confirmId ?? regId
        const postTimestamp = (confirmId ? item.confirmTimestamp : item.timestamp) * 1000

        const isWarning = ['vote_warning', 'reliability_warning'].includes(item.event)
        const type = isWarning
          ? PENALTY_TYPE.Warning
          : item.penaltyPoint === 3
          ? PENALTY_TYPE.immediateKickout
          : PENALTY_TYPE.Strike

        const status = getPenaltyStatus(item.confirmResult)
        const dataDesc = LSV_PENALTY_DATA_DESC_MAP[item.event]

        return {
          ...item,
          height,
          regId,
          confirmId,
          timestamp: item.timestamp * 1000,
          confirmTimestamp: Number(item.confirmTimestamp) * 1000,
          posterId,
          postTimestamp,
          type,
          status,
          dataDesc,
        }
      }) ?? [],
    [data]
  )

  const getLSVEvents = useCallback(
    (event: PenaltyEvent | PenaltyEvent[]) => {
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
      // const posterId = item.confirmId ?? item.regId
      // const postTimestamp = item.confirmId ? item.confirmTimestamp : item.timestamp
      return {
        ...item,
        refLink,
        desc,
        // posterId,
        // postTimestamp,
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

      const notConfirmed = penalties.find((item) => item.status === PENALTY_STATUS.NotConfirmed)
      if (notConfirmed) return notConfirmed

      const confirmed = penalties.find((item) => item.status === PENALTY_STATUS.Confirmed)
      if (confirmed) return confirmed

      const discarded = penalties.find((item) => item.status === PENALTY_STATUS.Discarded)
      if (discarded) return discarded

      return undefined
    },
    [getVotePenaltiesByProposal]
  )

  return {
    allPenalties,
    getLSVEvents,
    votePenalties,
    getVotePenaltiesByProposal,
    getRepVotePenaltyByProposal,
    isLoading,
    mutate,
  }
}

export default useLSVPenalty

function getPenaltyStatus(confirmResult: 'y' | 'n' | 'd'): PENALTY_STATUS {
  switch (confirmResult) {
    case 'y':
      return PENALTY_STATUS.Confirmed
    case 'n':
      return PENALTY_STATUS.NotConfirmed
    case 'd':
      return PENALTY_STATUS.Discarded
    default:
      return PENALTY_STATUS.NotConfirmed
  }
}
