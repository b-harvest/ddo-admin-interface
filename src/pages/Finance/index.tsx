import BigNumber from 'bignumber.js'
import AppPage from 'components/AppPage'
import TableList from 'components/TableList'
import Tag from 'components/Tag'
import useAsset from 'hooks/useAsset'
import usePair from 'hooks/usePair'
import usePool from 'hooks/usePool'
import AssetTableLogoCell from 'pages/components/AssetTableLogoCell'
import { useMemo } from 'react'
import type { AssetDetail } from 'types/asset'

import TVLChart from './sections/TVLChart'
import VolumeChart from './sections/VolumeChart'

// filtering
const TOKEN_TABLE_FILTERS = [
  {
    value: 'loop-non',
    label: 'Non-pool',
  },
  {
    value: 'loop',
    label: 'Pool Token',
  },
]

const PAIR_TABLE_FILTERS = [
  {
    value: 'bCRE',
    label: 'bCRE',
  },
  {
    value: 'ATOM',
    label: 'ATOM',
  },
  {
    value: 'WETH',
    label: 'WETH',
  },
  {
    value: 'USDC',
    label: 'USDC',
  },
]

export default function Finance() {
  const { allAsset } = useAsset()
  const { allPair, findPoolFromPairsByDenom, getTVLUSDbyDenom, getVol24USDbyDenom, getAssetTickers } = usePair()
  const { allPools, findPoolByDenom } = usePool()

  // All Tokens
  const tokenTableList = useMemo<AssetDetail[]>(() => {
    return allAsset
      .filter((item) => (item.isPoolToken ? findPoolFromPairsByDenom(item.denom) : true))
      .map((item) => {
        const asset = AssetTableLogoCell({ assets: getAssetTickers(item) })
        const vol24USD = getVol24USDbyDenom(item.denom)
        const tvlUSD = getTVLUSDbyDenom(item.denom)
        const priceOracle =
          (item.isPoolToken ? findPoolByDenom(item.denom)?.priceOracle : item.live?.priceOracle) ?? new BigNumber(0)
        const filter = [item.denom.includes('pool') ? TOKEN_TABLE_FILTERS[1].value : TOKEN_TABLE_FILTERS[0].value]

        return {
          ...item,
          asset,
          priceOracle,
          vol24USD,
          tvlUSD,
          filter,
        }
      })
  }, [findPoolFromPairsByDenom, allAsset, getTVLUSDbyDenom, getVol24USDbyDenom, findPoolByDenom, getAssetTickers])

  // All pairs
  const pairTableList = useMemo(() => {
    return allPair.map((pair) => {
      const asset = AssetTableLogoCell({ assets: pair.assetTickers })
      const baseTicker = pair.assetTickers[0].ticker
      const quoteTicker = pair.assetTickers[1].ticker
      const filter1 = PAIR_TABLE_FILTERS.find((item) => baseTicker.includes(item.value))?.value ?? ''
      const filter2 = PAIR_TABLE_FILTERS.find((item) => quoteTicker.includes(item.value))?.value ?? ''

      return {
        ...pair,
        asset,
        baseTicker,
        filter: [filter1, filter2],
      }
    })
  }, [allPair])

  // All pools
  const poolTableList = useMemo(() => {
    return allPools.map((pool) => {
      const baseTicker = pool.pair?.assetTickers[0].ticker ?? ''
      const quoteTicker = pool.pair?.assetTickers[1].ticker ?? ''
      const asset = AssetTableLogoCell({ assets: pool.pair?.assetTickers ?? [] })
      const apr = pool.apr.toNumber()
      const bcreApr = pool.bcreApr.isZero() ? null : pool.bcreApr.toNumber()
      const poolTypeTag = pool.isRanged ? <Tag status="strong">Ranged</Tag> : null
      const filter1 = PAIR_TABLE_FILTERS.find((item) => baseTicker.includes(item.value))?.value ?? ''
      const filter2 = PAIR_TABLE_FILTERS.find((item) => quoteTicker.includes(item.value))?.value ?? ''

      return {
        ...pool,
        baseTicker,
        asset,
        apr,
        bcreApr,
        poolTypeTag,
        filter: [filter1, filter2],
      }
    })
  }, [allPools])

  return (
    <AppPage>
      <section className="flex flex-col justify-between items-stretch space-y-4 md:flex-row md:space-x-4 md:space-y-0 mb-20">
        <TVLChart />
        <VolumeChart />
      </section>

      <section className="mb-20">
        <TableList
          title="All Tokens"
          useSearch={true}
          useNarrow={true}
          list={tokenTableList}
          defaultSortBy="tvlUSD"
          defaultIsSortASC={false}
          filterOptions={TOKEN_TABLE_FILTERS}
          defaultFilterIndex={1}
          nowrap={true}
          fields={[
            {
              label: 'Token',
              value: 'asset',
              sortValue: 'ticker',
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

      <section className="mb-20">
        <TableList
          title="All Pairs"
          useSearch={true}
          useNarrow={true}
          list={pairTableList}
          filterOptions={PAIR_TABLE_FILTERS}
          defaultSortBy="tvlUSD"
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
              label: 'Last price',
              value: 'lastPrice',
              type: 'bignumber',
              toFixedFallback: 6,
              responsive: true,
            },
            {
              label: 'Price 24h',
              value: 'change_24',
              type: 'change',
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
          ]}
        />
      </section>

      <section>
        <TableList
          title="All Pools"
          useSearch={true}
          useNarrow={true}
          list={poolTableList}
          filterOptions={PAIR_TABLE_FILTERS}
          defaultSortBy="tvlUSD"
          defaultIsSortASC={false}
          nowrap={true}
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
      </section>
    </AppPage>
  )
}
