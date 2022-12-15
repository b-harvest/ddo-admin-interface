import type { TokenAmountSet } from 'types/account'

export const getTokenWideFarmRewards = (allRewards: (TokenAmountSet & { poolDenom: string })[]) => {
  const tokenWideRewards: { [key: string]: (TokenAmountSet & { poolDenom: string })[] } = {}
  allRewards.forEach((item) => {
    const key = tokenWideRewards[item.denom]
    if (key) tokenWideRewards[item.denom].push(item)
    else tokenWideRewards[item.denom] = [item]
  })
  return tokenWideRewards
}
