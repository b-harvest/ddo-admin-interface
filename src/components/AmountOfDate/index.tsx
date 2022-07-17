import BigNumber from 'bignumber.js'
import { formatUSDAmount } from 'utils/amount'

export default function AmountOfDate({
  title,
  value,
  dateLabel,
  light = true,
  className = '',
}: {
  title?: string
  value: BigNumber
  dateLabel: string
  light?: boolean
  className?: string
}) {
  return (
    <div className={`${light ? 'text-white' : 'text-black'} text-left ${className}`}>
      {title && (
        <div
          className={`${
            light ? 'text-grayCRE-300 dark:text-grayCRE-400' : 'text-grayCRE-400-o'
          } TYPO-BODY-M !font-medium mb-2`}
        >
          {title}
        </div>
      )}
      <div className="flex flex-col justify-start items-start space-y-2">
        <div className="TYPO-BODY-XL !font-black FONT-MONO">
          {`${formatUSDAmount({ value, mantissa: 0 })}`}
          <span className="hidden ml-2 md:inline-block">{`(${formatUSDAmount({ value, abbr: true })})`}</span>
        </div>
        <div className="TYPO-BODY-XS !font-medium">{dateLabel}</div>
      </div>
    </div>
  )
}
