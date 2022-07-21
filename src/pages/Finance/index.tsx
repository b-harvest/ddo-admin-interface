import BigNumber from 'bignumber.js'
import AppPage from 'components/AppPage'
import TableList from 'components/TableList'
import useAsset from 'hooks/useAsset'
import usePair from 'hooks/usePair'
import usePool from 'hooks/usePool'
import AssetTableLogoCell from 'pages/components/AssetTableLogoCell'
import { useMemo } from 'react'

import TVLChart from './sections/TVLChart'
import VolumeChart from './sections/VolumeChart'

// filtering
const ASSET_TABLE_LIST_FILTERS = [
  {
    value: 'loop-non',
    label: 'Non-pool',
  },
  {
    value: 'loop',
    label: 'Pool Token',
  },
]

export default function Finance() {
  const { allAsset } = useAsset()
  const { findPoolFromPairsByDenom, getTVLUSDbyDenom, getVol24USDbyDenom, getAssetTickers } = usePair()
  const { findPoolByDenom } = usePool()

  // asset table
  const assetTableList = useMemo(() => {
    return allAsset
      .filter((item) => (item.isPoolToken ? findPoolFromPairsByDenom(item.denom) : true))
      .map((item, index) => {
        const asset = AssetTableLogoCell({ assets: getAssetTickers(item) })
        const vol24USD = getVol24USDbyDenom(item.denom)
        const tvlUSD = getTVLUSDbyDenom(item.denom)
        const priceOracle =
          (item.isPoolToken ? findPoolByDenom(item.denom)?.priceOracle : item.live?.priceOracle) ?? new BigNumber(0)
        const filter = item.denom.includes('pool')
          ? ASSET_TABLE_LIST_FILTERS[1].value
          : ASSET_TABLE_LIST_FILTERS[0].value

        return {
          index,
          denom: item.denom,
          ticker: item.ticker,
          asset,
          chainName: item.chainName,
          priceOracle,
          vol24USD,
          tvlUSD,
          exponent: item.exponent,
          filter,
        }
      })
  }, [findPoolFromPairsByDenom, allAsset, getTVLUSDbyDenom, getVol24USDbyDenom, findPoolByDenom, getAssetTickers])

  return (
    <AppPage>
      <section className="flex flex-col justify-between items-stretch space-y-4 md:flex-row md:space-x-4 md:space-y-0 mb-20">
        <TVLChart />
        <VolumeChart />
      </section>

      <section>
        <TableList
          title="Token List"
          useSearch={true}
          useNarrow={true}
          list={assetTableList}
          defaultSortBy="tvlUSD"
          defaultIsSortASC={false}
          filterOptions={ASSET_TABLE_LIST_FILTERS}
          nowrap={true}
          fields={[
            {
              label: 'Token',
              value: 'asset',
              type: 'html',
              widthRatio: 22,
            },
            {
              label: 'Denom',
              value: 'denom',
              abbrOver: 8,
              responsive: true,
            },
            {
              label: 'Chain',
              value: 'chainName',
              responsive: true,
            },
            {
              label: 'Price',
              value: 'priceOracle',
              type: 'usd',
              toFixedFallback: 2,
              responsive: true,
            },
            {
              label: 'Volume 24h',
              value: 'vol24USD',
              type: 'usd',
              toFixedFallback: 0,
            },
            {
              label: 'TVL',
              value: 'tvlUSD',
              type: 'usd',
              toFixedFallback: 0,
            },
          ]}
        />
      </section>
    </AppPage>
  )
}
