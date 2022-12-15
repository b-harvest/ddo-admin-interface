import BigNumber from 'bignumber.js'

import type { PoolDetail } from './pool'

export interface LiquidFarmLiveRaw {
  lfDenom: string
  poolId: number
  poolDenom: string
  feeRate: string
  minDepositAmount: string /** pools tokens min to liquidfarm */
  farmingAddr: string
  stakeAmount: string /** pool tokens LF module is farm staking  */
  compoundingAmount: string /** pool tokens that will be compounded in next epoch */
  lfTotalSupply: string
}

export type LiquidFarmLive = Omit<
  LiquidFarmLiveRaw,
  'minDepositAmount' | 'stakeAmount' | 'compoundingAmount' | 'lfTotalSupply'
> & {
  minDepositAmount: BigNumber
  stakeAmount: BigNumber
  compoundingAmount: BigNumber
  lfTotalSupply: BigNumber
  lfTokenExponent: number
  pool: PoolDetail
}

export type LiquidFarmDetail = LiquidFarmLive & {
  mintAmountPerPoolToken: BigNumber
  receiveAmountPerLfToken: BigNumber
  priceOracle: BigNumber
}
