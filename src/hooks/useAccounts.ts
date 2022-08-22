import BigNumber from 'bignumber.js'
import { useAllAccountsRank } from 'data/useAPI'
import { useCallback, useMemo } from 'react'

const useAccounts = () => {
  const { data: allAccountsRankData, isLoading } = useAllAccountsRank()

  // rankTypes
  const rankTypes = useMemo<string[]>(
    () => allAccountsRankData?.data.map((item) => item.rankType) ?? [],
    [allAccountsRankData]
  )

  // get ranks
  const getRanks = useCallback(
    (rankType: string) => {
      const ranksData = allAccountsRankData?.data.find((item) => item.rankType === rankType)
      const ranks =
        ranksData?.rankData.map((item, index) => ({
          ...item,
          usd: new BigNumber(item.usd),
          rank: index + 1,
        })) ?? []
      const timestamp = ranksData ? ranksData.updateTimestamp * 1000 : undefined
      return {
        ranks,
        timestamp,
      }
    },
    [allAccountsRankData]
  )

  // farm ranks
  // const farmRanksData = useMemo<AccountRankRaw | undefined>(
  //   () => allAccountsRankData?.data.find((item) => item.rankType === 'farming'),
  //   [allAccountsRankData]
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
  //   () => allAccountsRankData?.data.find((item) => item.rankType === 'balance'),
  //   [allAccountsRankData]
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
  //   () => allAccountsRankData?.data.find((item) => item.rankType === 'total'),
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
