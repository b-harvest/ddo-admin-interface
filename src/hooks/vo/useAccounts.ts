import BigNumber from 'bignumber.js'
import { useAllAccounts } from 'data/vo/useAPI'
import { useCallback, useMemo } from 'react'

const useAccounts = () => {
  const { data: allAccountsData, isLoading } = useAllAccounts()
  console.log('hooks -> vo -> useAccounts.ts')
  console.log(allAccountsData?.data)

  // rankTypes
  const rankTypes = useMemo<string[]>(
    // () => allAccountsData?.data.map((item) => item.chain) ?? [],
    () => allAccountsData?.data.map((item) => item.rankType) ?? [],
    [allAccountsData]
  )

  // get ranks
  const getRanks = useCallback(
    (rankType: string) => {
      if(rankType === 'total') {
        rankType = allAccountsData?.data[0].rankType
      }
      const ranksData = allAccountsData?.data.find((item) => item.rankType === rankType)
      const ranks =
        ranksData?.rankData.map((item, index) => ({
          ...item,
          usd: new BigNumber(item.usd),
          //usd: "$" + item.usd,
          rank: index + 1,
        })) ?? []
      const timestamp = ranksData ? ranksData.updateTimestamp * 1000 : undefined
      console.log(ranks)
      return {
        ranks,
        timestamp,
      }
    },
    [allAccountsData]
  )

  // farm ranks
  // const farmRanksData = useMemo<AccountRankRaw | undefined>(
  //   () => allAccountsData?.data.find((item) => item.rankType === 'farming'),
  //   [allAccountsData]
  // )

  // const farmRanks = useMemo<RankData[]>(() => {
  //   return (
  //     farmRanksData?.rankData.map((item, index) => ({
  //       ...item,
  //       usd: new BigNumber(item.usd),
  //       rank: index + 1,
  //     })) ?? []
  //   )
  // }, [farmRanksData])

  // const farmRanksTimestamp = useMemo<number | undefined>(
  //   () => (farmRanksData ? farmRanksData.updateTimestamp * 1000 : undefined),
  //   [farmRanksData]
  // )

  // // balance ranks
  // const balanceRanksData = useMemo<AccountRankRaw | undefined>(
  //   () => allAccountsData?.data.find((item) => item.rankType === 'balance'),
  //   [allAccountsData]
  // )

  // const balanceRanks = useMemo<RankData[]>(() => {
  //   return (
  //     balanceRanksData?.rankData.map((item, index) => ({
  //       ...item,
  //       usd: new BigNumber(item.usd),
  //       rank: index + 1,
  //     })) ?? []
  //   )
  // }, [balanceRanksData])

  // const balanceRanksTimestamp = useMemo<number | undefined>(
  //   () => (balanceRanksData ? balanceRanksData.updateTimestamp * 1000 : undefined),
  //   [balanceRanksData]
  // )

  // // total ranks
  // const totalRanksData = useMemo<AccountRankRaw | undefined>(
  //   () => allAccountsData?.data.find((item) => item.rankType === 'total'),
  //   [allAccountsRankData]
  // )

  // const totalRanks = useMemo<RankData[]>(() => {
  //   return (
  //     totalRanksData?.rankData.map((item, index) => ({
  //       ...item,
  //       usd: new BigNumber(item.usd),
  //       rank: index + 1,
  //     })) ?? []
  //   )
  // }, [totalRanksData])

  // const totalRanksTimestamp = useMemo<number | undefined>(
  //   () => (totalRanksData ? totalRanksData.updateTimestamp * 1000 : undefined),
  //   [totalRanksData]
  // )

  return {
    rankTypes,
    getRanks,
    // farmRanks,
    // farmRanksTimestamp,
    // balanceRanks,
    // balanceRanksTimestamp,
    // totalRanks,
    // totalRanksTimestamp,
    isLoading,
  }
}

export default useAccounts
