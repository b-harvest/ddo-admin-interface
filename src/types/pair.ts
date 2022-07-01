export interface PoolRaw {
  poolId: number
  poolType: number
  poolDenom: string
  totalSupply: string
  reserved: Array<{ denom: string; amount: string }>
}

export interface PairInfo {
  pairId: number
  baseDenom: string
  quoteDenom: string
  lastPriceFixed: string
  pools: Array<PoolRaw>
}

export interface PairLive {
  baseDenom: string
  change_24: number
  high_24: number
  lastPriceFixed: string
  low_24: number
  open_24: number
  pairId: number
  predPriceFixed: string
  quoteDenom: string
  ts_24: number
  vol_24: number
  totalReserved: Array<{ denom: string; priceOracle: number; amount: string; poolId: number }>
}

// export interface LivePair extends Omit<LivePairRaw, 'totalReserved' | 'lastPriceDec'> {
//   lastPriceDec: BigNumber
//   totalReserved: Array<{ denom: string; priceOracle: BigNumber; amount: BigNumber }>
// }
// export interface LivePairWithMyAmount extends LivePair {
//   myAmount: BigNumber
//   myAmountUsd: BigNumber
// }
// export interface LivePairDetail extends LivePair {
//   assets: [InfoAsset, InfoAsset]
// }
// export interface PairDetail extends LivePair {
//   pools: Array<Pool>
//   assets: [InfoAsset, InfoAsset]
//   myBalance?: BigNumber
//   myRewards?: any[]
//   myTotalRewardUsd?: BigNumber
//   staking?: any
//   tvl?: BigNumber
// }

// export interface Pool {
//   poolId: number
//   reserved: Array<{ denom: string; amount: BigNumber }>
//   poolDenom: string
//   totalSupply: BigNumber
// }
