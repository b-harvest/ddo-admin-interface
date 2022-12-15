import BigNumber from 'bignumber.js'
import { useAtom } from 'jotai'
import { useCallback, useMemo } from 'react'
import { allLiquidFarmLiveAtomRef } from 'state/atoms'
import type { LiquidFarmDetail, LiquidFarmLive } from 'types/liquidFarm'

import useAsset from './useAsset'
import usePool from './usePool'

const useLiquidFarm = () => {
  const [allLiquidFarmLiveAtom] = useAtom(allLiquidFarmLiveAtomRef)

  const { findPoolById } = usePool()
  const { findAssetByDenom } = useAsset()

  const allLiquidFarmsLive = useMemo<LiquidFarmLive[]>(() => {
    return allLiquidFarmLiveAtom
      .map((lf) => {
        const pool = findPoolById(lf.poolId)
        if (pool === undefined) return undefined

        const lfTokenExponent = findAssetByDenom(lf.lfDenom)?.exponent ?? 12

        const minDepositAmount = new BigNumber(lf.minDepositAmount)
          .shiftedBy(-pool.poolTokenExponent)
          .dp(pool.poolTokenExponent, BigNumber.ROUND_DOWN)

        const stakeAmount = new BigNumber(lf.stakeAmount)
          .shiftedBy(-pool.poolTokenExponent)
          .dp(pool.poolTokenExponent, BigNumber.ROUND_DOWN)

        const compoundingAmount = new BigNumber(lf.compoundingAmount)
          .shiftedBy(-pool.poolTokenExponent)
          .dp(pool.poolTokenExponent, BigNumber.ROUND_DOWN)

        const lfTotalSupply = new BigNumber(lf.lfTotalSupply)
          .shiftedBy(-lfTokenExponent)
          .dp(lfTokenExponent, BigNumber.ROUND_DOWN)

        return {
          ...lf,
          minDepositAmount,
          stakeAmount,
          compoundingAmount,
          lfTotalSupply,
          lfTokenExponent,
          pool,
        }
      })
      .filter(isLiquidFarm)
  }, [allLiquidFarmLiveAtom, findAssetByDenom, findPoolById])

  const allLiquidFarms = useMemo<LiquidFarmDetail[]>(() => {
    return allLiquidFarmsLive.map((lf) => {
      const mintAmountPerPoolToken =
        lf.stakeAmount.gt(0) && lf.lfTotalSupply.gt(0)
          ? lf.lfTotalSupply.div(lf.stakeAmount).dp(lf.lfTokenExponent, BigNumber.ROUND_DOWN)
          : new BigNumber(1)

      const receiveAmountPerLfToken = lf.lfTotalSupply.gt(0)
        ? lf.stakeAmount
            .minus(lf.compoundingAmount)
            .div(lf.lfTotalSupply)
            .dp(lf.pool.poolTokenExponent, BigNumber.ROUND_DOWN)
        : new BigNumber(0)

      const priceOracle = receiveAmountPerLfToken.multipliedBy(lf.pool.priceOracle)

      return {
        ...lf,
        mintAmountPerPoolToken,
        receiveAmountPerLfToken,
        priceOracle,
      }
    })
  }, [allLiquidFarmsLive])

  const findLiquidFarmByDenom = useCallback(
    (lfDenom: string) => allLiquidFarms.find((lf) => lf.lfDenom === lfDenom),
    [allLiquidFarms]
  )

  return { allLiquidFarms, findLiquidFarmByDenom }
}

export default useLiquidFarm

/** @summary type guard */
function isLiquidFarm(lf: LiquidFarmLive | undefined): lf is LiquidFarmLive {
  return lf !== undefined
}
