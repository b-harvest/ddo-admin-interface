import AppPage from 'components/AppPage'
import TableList from 'components/TableList'
import { useAtom } from 'jotai'
import { allAssetInfoAtomRef } from 'state/atoms'

export default function Asset() {
  const [assetInfosAtom] = useAtom(allAssetInfoAtomRef)

  return (
    <AppPage>
      <TableList
        title="All Asset"
        useSearch={true}
        list={assetInfosAtom}
        fields={[
          {
            label: 'Logo',
            value: 'logoUrl',
            type: 'imgUrl',
            size: 24,
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
            label: 'chainId',
            value: 'chainId',
          },
        ]}
      />
    </AppPage>
  )
}
