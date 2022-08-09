import type { FilterRadioGroupOption } from 'components/FilterRadioGroup'
import TableList from 'components/TableList'
import Tag from 'components/Tag'
import usePool from 'hooks/usePool'
import AssetLogoLabel from 'pages/components/AssetLogoLabel'
import { useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import type { Asset, AssetDetail } from 'types/asset'
import type { PairDetail } from 'types/pair'
import { PoolDetail } from 'types/pool'

type PoolTableItem = Omit<PoolDetail, 'bcreApr'> & {
  baseTicker: string
  asset: JSX.Element
  bcreApr: number | null
  poolTypeTag: JSX.Element | null
  filter: string[]
}

export default function PoolsTable({
  title = 'All Pools',
  byAsset,
  byPair,
  filters,
}: {
  title?: string
  byAsset?: Asset | AssetDetail
  byPair?: PairDetail
  filters?: FilterRadioGroupOption[]
}) {
  const { allPools } = usePool()

  // All pools
  const poolTableList = useMemo<PoolTableItem[]>(() => {
    const denom = byAsset?.denom
    const pairId = byPair?.pairId

    return allPools
      .filter(
        (pool) =>
          !denom ||
          (byAsset?.isPoolToken
            ? pool.poolDenom === denom
            : [pool.pair.baseDenom, pool.pair.quoteDenom].includes(denom))
      )
      .filter((pool) => !pairId || pool.pairId === pairId)
      .map((pool) => {
        const baseTicker = pool.pair?.assetTickers[0].ticker ?? ''
        const quoteTicker = pool.pair?.assetTickers[1].ticker ?? ''
        const asset = AssetLogoLabel({ assets: pool.pair?.assetTickers ?? [] })
        // const apr = pool.apr.toNumber()
        const bcreApr = pool.bcreApr.isZero() ? null : pool.bcreApr.toNumber()
        const poolTypeTag = pool.isRanged ? <Tag status="strong">Ranged</Tag> : null
        const filter1 = filters?.find((item) => baseTicker.includes(item.value))?.value ?? ''
        const filter2 = filters?.find((item) => quoteTicker.includes(item.value))?.value ?? ''

        return {
          ...pool,
          baseTicker,
          asset,
          // apr,
          bcreApr,
          poolTypeTag,
          filter: filters ? [filter1, filter2] : [],
        }
      })
  }, [allPools, filters, byAsset, byPair])

  const history = useHistory()
  const onRowClick = (row: PoolTableItem) => {
    history.push(`/pool/${row.poolId}`)
  }

  return (
    <TableList<PoolTableItem>
      title={title}
      useSearch={!byAsset?.isPoolToken}
      useNarrow={true}
      list={poolTableList}
      filterOptions={filters}
      defaultSortBy={byAsset?.isPoolToken ? undefined : 'tvlUSD'}
      defaultIsSortASC={false}
      nowrap={true}
      onRowClick={onRowClick}
      fields={[
        {
          label: 'Pool base/quote',
          value: 'asset',
          sortValue: 'baseTicker',
          type: 'html',
          widthRatio: 22,
        },
        {
          label: 'Pool #',
          value: 'poolId',
          widthRatio: 4,
          responsive: true,
        },
        {
          label: 'Pool price',
          value: 'poolPrice',
          type: 'bignumber',
          toFixedFallback: 6,
          responsive: true,
        },
        {
          label: '',
          value: 'poolTypeTag',
          type: 'html',
          responsive: true,
        },
        {
          label: 'APR',
          value: 'apr',
          type: 'change',
          neutral: true,
        },
        {
          label: '+bCRE',
          value: 'bcreApr',
          type: 'change',
          strong: true,
          align: 'left',
          responsive: true,
        },
        {
          label: 'TVL',
          value: 'tvlUSD',
          type: 'usd',
          toFixedFallback: 0,
        },
      ]}
    />
  )
}
