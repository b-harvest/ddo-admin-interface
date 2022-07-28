import Indicator from 'components/Indicator'
import { TIMESTAMP_FORMAT } from 'constants/time'
import dayjs from 'dayjs'
import { useMemo } from 'react'

export default function BlockChartHead({
  title,
  value,
  height,
  timestamp,
}: {
  title: string
  value?: string | JSX.Element
  height: string | undefined
  timestamp?: number
}) {
  const label = useMemo(() => {
    const heightLabel = 'Height ' + (height ?? '-')
    const timestampLabel = timestamp ? dayjs(timestamp).format(TIMESTAMP_FORMAT) : '-'

    return (
      <div>
        <div>{heightLabel}</div>
        <div className="text-grayCRE-400 dark:text-grayCRE-300">{timestampLabel}</div>
      </div>
    )
  }, [height, timestamp])

  return (
    <Indicator title={title} light={true} label={label}>
      <div className="flex TYPO-BODY-XL !font-bold">{value}</div>
    </Indicator>
  )
}
