import BigNumber from 'bignumber.js'
import numbro from 'numbro'

export const formatUSDAmount = ({
  value,
  mantissa = 2,
  currencySymbol = '$',
  abbr = false,
}: {
  value?: BigNumber
  mantissa?: number
  currencySymbol?: string
  abbr?: boolean
}) => {
  const prefix = currencySymbol ?? ''
  if (value === undefined) return '-'
  if (value.isZero()) return `${prefix}0`
  if (value.isLessThan(0.01)) return `<${prefix}0.01`

  if (abbr) {
    const number = value.toNumber()
    return numbro(number).formatCurrency({
      average: true,
      mantissa: number > 1000 ? 2 : mantissa,
      abbreviations: {
        billion: 'b',
        million: 'm',
        thousand: 'k',
      },
      prefix: '',
      currencySymbol: '≈',
    })
  }

  return `${prefix}${value.toFormat(mantissa, BigNumber.ROUND_HALF_UP)}`
}
