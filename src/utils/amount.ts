import BigNumber from 'bignumber.js'
import numbro from 'numbro'

// using a currency library here in case we want to add more in future
export const formatUSDAmount = (amt: BigNumber | undefined, digits = 2, average = true) => {
  const num = amt?.toNumber()

  if (num === 0) return '0'
  if (!num) return '-'
  if (num < 0.001 && digits <= 3) {
    return '<0.001'
  }

  return numbro(num).formatCurrency({
    average,
    mantissa: num > 1000 ? 2 : digits,
    abbreviations: {
      billion: 'b',
      million: 'm',
      thousand: 'k',
    },
    prefix: '',
    currencySymbol: '≈',
  })
}
