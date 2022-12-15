import { useFetchLpFarmRewardsByPoolLCD } from 'data/useLCD'
import { useEffect } from 'react'
import { LpFarmRewardsLCDRaw } from 'types/account'

/** @summary jsx abstraction to fetch depending on dynamic data */
const AccountDataRewardsLCDFetcher = ({
  address,
  poolDenom,
  onFetched,
  interval,
}: {
  address: string
  poolDenom: string
  onFetched: (data: LpFarmRewardsLCDRaw, poolDenom: string) => void
  interval: number
}) => {
  const { data, isLoading } = useFetchLpFarmRewardsByPoolLCD(
    {
      address,
      poolDenom,
    },
    interval
  )

  useEffect(() => {
    if (isLoading === false && data !== undefined) onFetched(data, poolDenom)
  }, [isLoading, data])

  return <></>
}

export default AccountDataRewardsLCDFetcher
