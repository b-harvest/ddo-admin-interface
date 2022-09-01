import Icon, { IconType } from 'components/Icon'
import { useMemo } from 'react'

type StrikeBoardProps = {
  current: number
  max: number
  iconType?: IconType
  title?: string
}

export default function StrikeBoard({ current, max, iconType = 'strike', title }: StrikeBoardProps) {
  const strikes = useMemo<boolean[]>(
    () => new Array(max).fill(false).map((_, index) => index + 1 <= current),
    [max, current]
  )

  return (
    <div
      className="inline-flex items-center gap-3 bg-[#EAEAEA] dark:bg-black px-4 py-3 rounded-md"
      title={title ?? `${current} strike confirmed out of ${max}`}
    >
      <Icon type={iconType} />
      <ul className="flex justify-start items-center gap-2">
        {strikes.map((strike, i) => (
          <div
            key={`strike-${i}-${strike}`}
            className={`w-4 h-4 ${
              current >= max ? 'bg-error' : strike ? 'bg-warning' : 'bg-grayCRE-300 dark:bg-grayCRE-500'
            } rounded-full`}
          ></div>
        ))}
      </ul>
    </div>
  )
}
