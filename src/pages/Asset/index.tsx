import BigNumber from 'bignumber.js'
import AppPage from 'components/AppPage'
import TableList from 'components/TableList'
import useAsset from 'hooks/useAsset'
import usePair from 'hooks/usePair'
import AssetTableCell from 'pages/components/AssetTableCell'
import { useEffect, useState } from 'react'

export default function Asset() {
  const { allAsset } = useAsset()
  console.log('allAsset', allAsset)
  const { getTVLbyDenom, getVol24USDbyDenom } = usePair()

  const [assetTableList, setAssetTableList] = useState<any>([])

  useEffect(() => {
    const list = allAsset.map((item, index) => {
      const asset = AssetTableCell({ logoUrl: item.logoUrl, ticker: item.ticker })
      const vol24USD = getVol24USDbyDenom(item.denom, item.exponent)
      const tvl = getTVLbyDenom(item.denom).dividedBy(10 ** item.exponent)
      const tvlUSD = item.live ? tvl.multipliedBy(new BigNumber(item.live.priceOracle)) : null
      const priceOracle = item.live ? new BigNumber(item.live.priceOracle) : null

      return {
        index,
        asset,
        chainName: item.chainName,
        tvl,
        priceOracle,
        vol24USD,
        tvlUSD,
        exponent: item.exponent,
      }
    })
    setAssetTableList(list)
  }, [allAsset, getTVLbyDenom, getVol24USDbyDenom])

  return (
    <AppPage>
      <TableList
        title="All Asset"
        useSearch={true}
        useNarrow={true}
        list={assetTableList}
        fields={[
          {
            label: 'Ticker',
            value: 'asset',
            type: 'html',
            widthRatio: 18,
          },
          {
            label: 'Chain',
            value: 'chainName',
          },
          {
            label: 'Price',
            value: 'priceOracle',
            type: 'usd',
            toFixedFallback: 2,
          },
          {
            label: 'Volume 24h',
            value: 'vol24USD',
            type: 'usd',
            toFixedFallback: 2,
          },
          {
            label: 'TVL',
            value: 'tvlUSD',
            type: 'usd',
            toFixedFallback: 2,
          },
        ]}
      />
    </AppPage>
  )
}
