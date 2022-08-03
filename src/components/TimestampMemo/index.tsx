import { TIMESTAMP_FORMAT } from 'constants/time'
import dayjs from 'dayjs'
import { useMemo } from 'react'

export default function TimestampMemo({ timestamp }: { timestamp: number | undefined }) {
  const memo = useMemo<string>(() => (timestamp ? `${dayjs(timestamp).format(TIMESTAMP_FORMAT)}` : '-'), [timestamp])
  return (
    <div className="flex items-center space-x-2 TYPO-BODY-XS !font-medium">
      <div className="shrink-0 grow-0">Last synced</div> <div className="shrink-0 grow-0">{memo}</div>
    </div>
  )
}
