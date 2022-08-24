import { useLSVEventByAddr } from 'data/useAPI'
import { useCallback, useMemo } from 'react'
import type { LSVEventType, LSVEventVoteWarn } from 'types/lsv'

const useLSVEvent = (address: string) => {
  const { data, isLoading } = useLSVEventByAddr({ address })

  const getLSVEvents = useCallback(
    (event: LSVEventType) => {
      const events = data?.data.filter((item) => item.event === event)
      return (
        events?.map((item) => ({
          ...item,
          timestamp: item.timestamp * 1000,
          confirmTimestamp: Number(item.confirmTimestamp) * 1000,
        })) ?? []
      )
    },
    [data]
  )

  const votePenalties = useMemo<LSVEventVoteWarn[]>(() => {
    const voteWarnedList = getLSVEvents('vote_warning') as LSVEventVoteWarn[]
    const votePenaltyList = getLSVEvents('vote_penalty') as LSVEventVoteWarn[]
    return voteWarnedList.concat(votePenaltyList)
  }, [getLSVEvents])

  return { getLSVEvents, votePenalties, isLoading }
}

export default useLSVEvent
