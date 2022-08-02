import type { FilterRadioGroupOption } from 'components/FilterRadioGroup'
import TableList from 'components/TableList'
import usePair from 'hooks/usePair'
import AssetLogoLabel from 'pages/components/AssetLogoLabel'
import { useMemo } from 'react'
import type { Asset, AssetDetail } from 'types/asset'

export default function PairsTable({
  title = 'All Pairs',
  byAsset,

  filters,
}: {
  title?: string
  byAsset?: Asset | AssetDetail

  filters?: FilterRadioGroupOption[]
}) {
  const { allPair } = usePair()

  const pairTableList = useMemo(() => {
    const denom = byAsset?.denom
    return allPair
      .filter(
        (pair) =>
          !denom ||
          (byAsset?.isPoolToken
            ? pair.pools.map((pool) => pool.poolDenom).includes(denom)
            : [pair.baseDenom, pair.quoteDenom].includes(denom))
      )
      .map((pair) => {
        const asset = AssetLogoLabel({ assets: pair.assetTickers })
        const baseTicker = pair.assetTickers[0].ticker
        const quoteTicker = pair.assetTickers[1].ticker
        const filter1 = filters?.find((item) => baseTicker.includes(item.value))?.value ?? ''
        const filter2 = filters?.find((item) => quoteTicker.includes(item.value))?.value ?? ''

        return {
          ...pair,
          asset,
          baseTicker,
          filter: filters ? [filter1, filter2] : [],
        }
      })
  }, [allPair, byAsset, filters])

  return (
    <TableList
      title={title}
      useSearch={!byAsset?.isPoolToken}
      useNarrow={true}
      list={pairTableList}
      filterOptions={filters}
      defaultSortBy={byAsset?.isPoolToken ? undefined : 'tvlUSD'}
      defaultIsSortASC={false}
      nowrap={true}
      fields={[
        {
          label: 'Pair base/quote',
          value: 'asset',
          sortValue: 'baseTicker',
          type: 'html',
          widthRatio: 22,
        },
        {
          label: 'Pair #',
          value: 'pairId',
          widthRatio: 4,
          responsive: true,
        },
        {
          label: 'Price 24h',
          value: 'change_24',
          type: 'change',
        },
        {
          label: 'Last price',
          value: 'lastPrice',
          type: 'bignumber',
          toFixedFallback: 6,
          responsive: true,
        },
        {
          label: 'Predicted price',
          value: 'predPrice',
          type: 'bignumber',
          toFixedFallback: 6,
          responsive: true,
        },
        {
          label: 'Volume 24h',
          value: 'vol24USD',
          type: 'usd',
          toFixedFallback: 0,
          responsive: true,
        },
        {
          label: 'TVL',
          value: 'tvlUSD',
          type: 'usd',
          toFixedFallback: 0,
        },
        {
          label: 'Volume/TVL',
          value: 'volTvlRatio',
          type: 'change',
          neutral: true,
          responsive: true,
        },
      ]}
    />
  )
}
