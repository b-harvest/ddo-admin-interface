import BigNumber from 'bignumber.js'

/** @description currency list; https://www.six-group.com/dam/download/financial-information/data-center/iso-currrency/lists/list-one.xml */
export const formatAmount = ({
  value,
  mantissa = 2,
  currency,
  compact = false,
  semiequate = false,
}: {
  value: BigNumber | undefined
  mantissa?: number
  currency?: string
  compact?: boolean
  semiequate?: boolean
}) => {
  if (value === undefined) return '-'

  const formatter = new Intl.NumberFormat('en', {
    style: currency === undefined ? 'decimal' : 'currency',
    currency,
    notation: compact ? 'compact' : 'standard',
    compactDisplay: 'short',
    // @ts-ignore
    trailingZeroDisplay: 'stripIfInteger',
    maximumFractionDigits: mantissa,
    minimumFractionDigits: mantissa,
  })

  const number = value.dp(mantissa, BigNumber.ROUND_DOWN).toNumber()
  const formattedValue = formatter.format(number).toLowerCase()

  const currencySymbol = currency === undefined ? '' : formattedValue.charAt(0)
  const min = new BigNumber(1).shiftedBy(-mantissa)
  const formattedMin = `<${currencySymbol}${min.toFormat(mantissa)}`

  return `${semiequate ? '≈' : ''}${!value.isZero() && value.lt(min) ? formattedMin : formattedValue}`
}

export const formatUSDAmount = ({
  value,
  mantissa = 2,
  compact = false,
  semiequate = false,
  noCurrencySymbol = false,
}: {
  value?: BigNumber
  mantissa?: number
  compact?: boolean
  semiequate?: boolean
  noCurrencySymbol?: boolean
}) => {
  return formatAmount({ value, mantissa, currency: noCurrencySymbol ? undefined : 'USD', compact, semiequate })
}
