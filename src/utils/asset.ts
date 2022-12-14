import { TokenTypes } from 'constants/asset'
import type { AssetInfo } from 'types/asset'

export const getTokenType = (asset: AssetInfo): TokenTypes => {
  if (asset.denom === 'ucre' || asset.denom === 'ubcre') return TokenTypes.NATIVE
  if (asset.denom.startsWith('pool')) return TokenTypes.POOL
  if (asset.denom.startsWith('lf')) return TokenTypes.LF
  return TokenTypes.NORMAL
}
