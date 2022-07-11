import AppPage from 'components/AppPage'
import TableList from 'components/TableList'
import { useAtom } from 'jotai'
import AssetTableCell from 'pages/components/AssetTableCell'
import { useMemo } from 'react'
import { allAssetInfoAtomRef } from 'state/atoms'

export default function Asset() {
  const [allAssetInfoAtom] = useAtom(allAssetInfoAtomRef)

  const assetTableList = useMemo(() => {
    return allAssetInfoAtom.map((item) => {
      const asset = AssetTableCell({ logoUrl: item.logoUrl, ticker: item.ticker })
      return {
        asset,
        chainId: item.chainId,
      }
    })
  }, [allAssetInfoAtom])

  return (
    <AppPage>
      <TableList
        title="All Asset"
        useSearch={true}
        useNarrow={true}
        list={assetTableList}
        fields={[
          {
            label: 'Asset',
            value: 'asset',
            type: 'html',
            widthRatio: 10,
          },
          {
            label: 'Chain ID',
            value: 'chainId',
          },
        ]}
      />
    </AppPage>
  )
}
