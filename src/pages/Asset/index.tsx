import TableList from 'components/TableList'
import { useAllAssetInfo } from 'hooks/useAPI'
import type { APIHookReturn } from 'types/api'
import type { AssetInfo } from 'types/asset'

export default function Asset() {
  const {
    data: allAssetInfoData,
    isError: allAssetInfoIsError,
    isLoading: allAssetInfoIsLoading,
  }: APIHookReturn<AssetInfo[]> = useAllAssetInfo(6000)
  console.log('useAllAssetInfo', allAssetInfoData)

  return (
    <div>
      <TableList
        title="All Asset"
        useSearch={true}
        list={allAssetInfoData.data}
        fields={[
          {
            label: 'Logo',
            value: 'logoUrl',
            type: 'imgUrl',
            size: 32,
            widthRatio: 4,
          },
          {
            label: 'Ticker',
            value: 'ticker',
            widthRatio: 10,
          },
          // {
          //   label: 'Base Denom',
          //   value: 'baseDenom',
          // },
          {
            label: 'chainId',
            value: 'chainId',
          },
          {
            label: 'chainName',
            value: 'chainName',
          },
        ]}
      />
    </div>
  )
}
