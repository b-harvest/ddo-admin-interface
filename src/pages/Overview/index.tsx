import AppPage from 'components/AppPage'
import TableList from 'components/TableList'
import useAsset from 'hooks/useAsset'
import useChartData from 'hooks/useChartData'
import usePair from 'hooks/usePair'
import usePool from 'hooks/usePool'
import AssetLogoLabel from 'pages/components/AssetLogoLabel'
import PairsTable from 'pages/components/PairsTable'
import PoolsTable from 'pages/components/PoolsTable'
import usePages from 'pages/hooks/usePages'
import { useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import type { AssetDetail } from 'types/asset'

import TVLChart from '../components/TVLChart'
import VolumeChart from '../components/VolumeChart'

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

export default function Overview() {
  const history = useHistory()

  const { allAsset } = useAsset()
  const { findPoolFromPairsByDenom, getTVLUSDbyDenom, getVol24USDbyDenom } = usePair()
  const { findPoolByDenom, getAssetTickers } = usePool()

  // Charts
  const { tvlUSDChartData, volUSDChartData } = useChartData()
  const { routeTVLByTime, routeVolumeByTime } = usePages()

  // All Tokens
  const tokenTableList = useMemo<AssetDetail[]>(() => {
    return allAsset
      .filter((item) => (item.isPoolToken ? findPoolFromPairsByDenom(item.denom) : true))
      .map((item) => {
        const asset = AssetLogoLabel({ assets: getAssetTickers(item) })
        const vol24USD = getVol24USDbyDenom(item.denom)
        const tvlUSD = getTVLUSDbyDenom(item.denom)
        const priceOracle = item.isPoolToken ? findPoolByDenom(item.denom)?.priceOracle : item.live?.priceOracle
        // ?? new BigNumber(0)
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

  const handleTokenListRowClick = (row: AssetDetail) => {
    const denom = row.denom.split('/').join('-')
    history.push(`/token/${denom}`)
  }

  return (
    <AppPage>
      <section className="flex flex-col justify-between items-stretch space-y-4 md:flex-row md:space-x-4 md:space-y-0 mb-20">
        <TVLChart chartData={tvlUSDChartData} onClick={routeTVLByTime} />
        <VolumeChart chartData={volUSDChartData} onClick={routeVolumeByTime} />
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
          onRowClick={handleTokenListRowClick}
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
        <PairsTable filters={PAIR_TABLE_FILTERS} />
      </section>

      <section>
        <PoolsTable filters={PAIR_TABLE_FILTERS} />
      </section>
    </AppPage>
  )
}
