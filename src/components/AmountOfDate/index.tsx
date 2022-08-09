import BigNumber from 'bignumber.js'
import Indicator from 'components/Indicator'
import { formatUSDAmount } from 'utils/amount'

export default function AmountOfDate({
  title,
  value,
  dateLabel,
  light = true,
  currencySymbol = '$',
  className = '',
  hideAbbr = false,
}: {
  title?: string
  value: BigNumber
  dateLabel: string
  light?: boolean
  currencySymbol?: string
  className?: string
  hideAbbr?: boolean
}) {
  return (
    <Indicator title={title} label={dateLabel} className={className} light={light}>
      <div className="TYPO-BODY-XL !font-black FONT-MONO">
        {`${formatUSDAmount({ value, mantissa: 0, currencySymbol })}`}
        {hideAbbr ? null : (
          <span className="hidden ml-2 md:inline-block">{`(${formatUSDAmount({
            value,
            currencySymbol,
            abbr: true,
          })})`}</span>
        )}
      </div>
    </Indicator>
  )
}
