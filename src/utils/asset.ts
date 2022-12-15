import { TokenTypes } from 'constants/asset'
import type { AssetInfo } from 'types/asset'

export const getTokenType = (asset: AssetInfo): TokenTypes => {
  if (asset.denom === 'ucre' || asset.denom === 'ubcre') return TokenTypes.NATIVE
  if (asset.denom.startsWith('pool')) return TokenTypes.POOL
  if (asset.denom.startsWith('lf')) return TokenTypes.LF
  return TokenTypes.NORMAL
}

export const getOriginPoolDenom = (asset: AssetInfo, tokenType: TokenTypes): string | undefined => {
  if (tokenType === TokenTypes.POOL) return asset.denom
  if (tokenType === TokenTypes.LF) {
    const poolId = asset.denom.split('lf')[1]
    return poolId ? `pool${poolId}` : undefined
  }
  return undefined
}

/** @todo right? */
export const getExponentDiff = (base: number, quote: number) => quote - base
