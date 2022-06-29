import AppPage from 'components/AppPage'
import TableList from 'components/TableList'
import { useAtom } from 'jotai'
import { assetInfosAtomRef } from 'state/atoms'

export default function Asset() {
  const [assetInfosAtom] = useAtom(assetInfosAtomRef)

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
    </AppPage>
  )
}
