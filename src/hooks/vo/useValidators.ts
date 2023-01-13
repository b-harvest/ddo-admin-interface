import BigNumber from 'bignumber.js'
import { useAllValidatorList } from 'data/vo/useAPI'
import { useCallback, useMemo } from 'react'

const useValidators = () => {
  const { data: resData, isLoading } = useAllValidatorList()
  console.log('hooks -> vo -> useAllValidatorList.ts')
  console.log(resData?.data)

  const resTypes = useMemo<string[]>(
    () => resData?.data.map((item) => item.type) ?? [],
    [resData]
  )

  const getData = useCallback(
    (resType: string) => {
      if(resType === 'total') {
        resType = resData?.data[0].type
      }
      const resDataTemp = resData?.data.find((item) => item.type === resType)
      const ressTotal =
        resDataTemp?.rawData.map((item, index) => ({
        //resDataTemp?.rawData.slice(0,MAX_NUM_RENDER_DATA).map((item, index) => ({
          ...item,
          //fromAddressShort: item.fromAddress.slice(0,10) + "...",
          //toAddressShort: item.toAddress.slice(0,10) + "...",
          inUsd: new BigNumber(item.inUsd),
          inKrw: new BigNumber(item.inKrw),
          amountBig: new BigNumber(item.amount),
          variationBig: new BigNumber(item.variation),
          rank: index + 1,
        })) ?? []
      const timestamp = resDataTemp ? resDataTemp.updateTimestamp : undefined
      return {
        ressTotal,
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

export default useValidators
