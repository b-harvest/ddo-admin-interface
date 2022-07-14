import BigNumber from 'bignumber.js'
import numbro from 'numbro'

// using a currency library here in case we want to add more in future
export const formatBigUSDAmount = (amt: BigNumber | undefined, mantissa = 2, average = true) => {
  const num = amt?.toNumber()

  if (num === undefined) return '-'
  if (num === 0) return '0'
  if (num < 0.01) {
    return '<0.01'
  }

  return numbro(num).formatCurrency({
    average,
    mantissa: num > 1000 ? 2 : mantissa,
    abbreviations: {
      billion: 'b',
      million: 'm',
      thousand: 'k',
    },
    prefix: '',
    currencySymbol: '≈',
  })
}

export const formatUSDAmount = ({
  value,
  mantissa = 2,
  useCurrencySymbol = true,
}: {
  value: BigNumber
  mantissa?: number
  useCurrencySymbol?: boolean
}) => {
  const currency = useCurrencySymbol ? '$' : ''
  return value.isZero()
    ? `${currency}0`
    : value.isLessThan(0.01)
    ? `<${currency}0.01`
    : `${currency}${value.toFormat(mantissa, BigNumber.ROUND_HALF_UP)}`
}

// tmp to parse scientific notation for log digits number in js
export const longDigitsToFixed = (x: number) => {
  let fixed: string | undefined

  if (Math.abs(x) < 1.0) {
    const e = parseInt(x.toString().split('e-')[1])
    if (e) {
      x *= Math.pow(10, e - 1)
      fixed = '0.' + new Array(e).join('0') + x.toString().substring(2)
    }
  } else {
    let e = parseInt(x.toString().split('+')[1])
    if (e > 20) {
      e -= 20
      x /= Math.pow(10, e)
      fixed += new Array(e + 1).join('0')
    }
  }
  return fixed ?? `${x}`
}
