import BigNumber from 'bignumber.js'
import Indicator from 'components/Indicator'
import { formatUSDAmount } from 'utils/amount'

export default function AmountOfDate({
  title,
  value,
  valueCSS,
  dateLabel,
  light = true,
  className = '',
  hideAbbr = false,
}: {
  title?: string
  value?: BigNumber
  valueCSS?: string
  dateLabel: string
  light?: boolean
  className?: string
  hideAbbr?: boolean
}) {
  return (
    <Indicator title={title} label={dateLabel} className={className} light={light}>
      <div className={`TYPO-BODY-XL !font-black FONT-MONO ${valueCSS}`}>
        {formatUSDAmount({ value, mantissa: 0 })}
        {hideAbbr ? null : (
          <span className="hidden ml-2 md:inline-block">{`(${formatUSDAmount({
            value,
            compact: true,
            semiequate: true,
            noCurrencySymbol: true,
          })})`}</span>
        )}
      </div>
    </Indicator>
  )
}
