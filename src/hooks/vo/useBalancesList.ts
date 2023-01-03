import BigNumber from 'bignumber.js'
import { useAllBalancesList } from 'data/vo/useAPI'
import { useCallback, useMemo } from 'react'

const useAccounts = () => {
  const { data: resData, isLoading } = useAllBalancesList()
  console.log('hooks -> vo -> useAccounts.ts')
  console.log(resData?.data)

  const resTypes = useMemo<string[]>(
    () => resData?.data.map((item) => item.type) ?? [],
    [resData]
  )

  // get ranks
  const getData = useCallback(
    (resType: string) => {
      if(resType === 'total') {
        resType = resData?.data[0].type
      }
      const resDataTemp = resData?.data.find((item) => item.type === resType)
      const ress =
        resDataTemp?.rawData.map((item, index) => ({
          ...item,
          inUsd: new BigNumber(item.inUsd),
          inKrw: new BigNumber(item.inKrw),
          amountBig: new BigNumber(item.amount),
          variationBig: new BigNumber(item.variation),
          rank: index + 1,
        })) ?? []
      //const timestamp = resData ? resData.updateTimestamp * 1000 : undefined
      const timestamp = resDataTemp ? resDataTemp.updateTimestamp : undefined
      //console.log(ranks)
      return {
        ress,
        timestamp,
      }
    },
    [resData]
  )

  return {
    resTypes,
    getData,
    isLoading,
  }
}

export default useAccounts
