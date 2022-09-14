import { LSV_PENALTY_DATA_DESC_MAP } from 'constants/lsv'
import { usePenaltiesByLSV } from 'data/useAPI'
import { useCallback, useMemo } from 'react'
import { PENALTY_STATUS, PENALTY_TYPE } from 'types/lsv'
import { LSVEventVoteWarn, Penalty, PenaltyEvent, VotePenalty } from 'types/lsv'

const useLSVPenalty = (address: string) => {
  const { data, isLoading, mutate } = usePenaltiesByLSV({ address })

  const allPenalties = useMemo<Penalty[]>(
    () =>
      data?.data
        .filter((item) => item.event !== 'lsv_registered')
        .map((item) => {
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
            ...item.rawJson,
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
    return voteWarnedList.concat(votePenaltyList) as LSVEventVoteWarn[]
  }, [getLSVEvents])

  const getVotePenaltiesByProposal = useCallback(
    (proposalId: number) => votePenalties.filter((item) => item.rawJson?.proposalId === proposalId),
    [votePenalties]
  )

  const getRepVotePenaltyByProposal = useCallback(
    (proposalId: number) => {
      const votePenalties = getVotePenaltiesByProposal(proposalId)

      const getNotConfirmed = (penalties: VotePenalty[]) =>
        penalties.find((item) => item.status === PENALTY_STATUS.NotConfirmed)
      const getConfirmed = (penalties: VotePenalty[]) =>
        penalties.find((item) => item.status === PENALTY_STATUS.Confirmed)
      const getDiscarded = (penalties: VotePenalty[]) =>
        penalties.find((item) => item.status === PENALTY_STATUS.Discarded)

      const strikes = votePenalties.filter((item) => item.type === PENALTY_TYPE.Strike)
      const warnings = votePenalties.filter((item) => item.type === PENALTY_TYPE.Warning)

      if (strikes.length) {
        const notConfirmed = getNotConfirmed(strikes)
        if (notConfirmed) return notConfirmed

        const confirmed = getConfirmed(strikes)
        if (confirmed) return confirmed

        const discarded = getDiscarded(strikes)
        if (discarded) return discarded
      } else if (warnings.length) {
        const notConfirmed = getNotConfirmed(warnings)
        if (notConfirmed) return notConfirmed

        const confirmed = getConfirmed(warnings)
        if (confirmed) return confirmed

        const discarded = getDiscarded(warnings)
        if (discarded) return discarded
      }

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
