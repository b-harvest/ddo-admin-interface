import { useLSVEventByAddr } from 'data/useAPI'
import { useCallback } from 'react'
import type { LSVEventType } from 'types/lsv'

const useLSVEvent = (address: string) => {
  const { data, isLoading } = useLSVEventByAddr({ address })
  console.log(data)

  const getLSVEvents = useCallback(
    (event: LSVEventType) => {
      const events = data?.data.filter((item) => item.event === event)
      return events?.map((item) => ({ ...item, timestamp: item.timestamp * 1000 })) ?? []
    },
    [data]
  )

  return { getLSVEvents }
}

export default useLSVEvent
