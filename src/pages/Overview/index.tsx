import AppPage from 'components/AppPage'
import TableList from 'components/TableList'
import { TokenTypes } from 'constants/asset'
import useAsset from 'hooks/useAsset'
import useChartData from 'hooks/useChartData'
import useLiquidFarm from 'hooks/useLiquidFarm'
import usePair from 'hooks/usePair'
import usePool from 'hooks/usePool'
import AssetLogoLabel from 'pages/components/AssetLogoLabel'
import PairsTable from 'pages/components/PairsTable'
import PoolsTable from 'pages/components/PoolsTable'
import usePages from 'pages/hooks/usePages'
import { useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import type { AssetDetail } from 'types/asset'
import { formatUSDAmount } from 'utils/amount'

import TVLChart from '../components/TVLChart'
import VolumeChart from '../components/VolumeChart'

// filtering
const TOKEN_TABLE_FILTERS = [
  {
    label: 'Non-pool',
    value: TokenTypes.NORMAL,
  },
  {
    label: 'Pool Token',
    value: TokenTypes.POOL,
  },
  {
    label: 'LF Token',
    value: TokenTypes.LF,
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
  const { findLiquidFarmByDenom } = useLiquidFarm()

  // Charts
  const { tvlUSDChartData, volUSDChartData, tvlUSDDataLoading, volUSDDataLoading } = useChartData()
  const { routeTVLByTime, routeVolumeByTime } = usePages()

  /** @todo move to useAsset hook; be cautious about infinite calling loop b/w hooks */
  const tokenTableList = useMemo<AssetDetail[]>(() => {
    return allAsset
      .filter((item) => (item.isPoolToken ? findPoolFromPairsByDenom(item.denom) : true))
      .map((item) => {
        const asset = AssetLogoLabel({ assets: getAssetTickers(item), tokenType: item.tokenType })
        const poolDetail = findPoolByDenom(item.denom)
        const priceOracle =
          item.tokenType === TokenTypes.POOL
            ? poolDetail?.priceOracle
            : item.tokenType === TokenTypes.LF
            ? findLiquidFarmByDenom(item.denom)?.priceOracle
            : item.live?.priceOracle

        const farmStakedUSD = poolDetail?.totalStakedAmount.multipliedBy(priceOracle ?? 0)
        const totalSupplyUSD = poolDetail?.totalSupplyAmount.multipliedBy(priceOracle ?? 0)

        const vol24USD = getVol24USDbyDenom(item.denom)
        const tvlUSD = item.tokenType === TokenTypes.POOL ? farmStakedUSD : getTVLUSDbyDenom(item.denom)

        const matchedFilterValue =
          item.tokenType === TokenTypes.NATIVE
            ? TokenTypes.NORMAL
            : TOKEN_TABLE_FILTERS.map((f) => f.value).find((value) => value === item.tokenType)
        const filter = [matchedFilterValue]

        return {
          ...item,
          asset,
          priceOracle,
          vol24USD,
          tvlUSD,
          farmStakedUSD,
          totalSupplyUSD,
          filter,
        }
      })
  }, [
    findPoolFromPairsByDenom,
    allAsset,
    getTVLUSDbyDenom,
    getVol24USDbyDenom,
    findPoolByDenom,
    getAssetTickers,
    findLiquidFarmByDenom,
  ])

  const handleTokenListRowClick = (row: AssetDetail) => {
    const denom = row.denom.split('/').join('-')
    history.push(`/token/${denom}`)
  }

  const onTokenTableTooltip = (cell: any, field: string, row: AssetDetail) => {
    const tooltip = row.isPoolToken ? (
      <>
        <div className="flex justify-between items-center gap-x-4">
          <span>Farmed</span>{' '}
          <span className="FONT-MONO">{formatUSDAmount({ value: row.farmStakedUSD, mantissa: 2 })}</span>
        </div>
      </>
    ) : undefined
    return tooltip
  }

  return (
    <AppPage>
      <section className="flex flex-col justify-between items-stretch space-y-4 md:flex-row md:space-x-4 md:space-y-0 mb-20">
        <TVLChart chartData={tvlUSDChartData} onClick={routeTVLByTime} isLoading={tvlUSDDataLoading} />
        <VolumeChart chartData={volUSDChartData} onClick={routeVolumeByTime} isLoading={volUSDDataLoading} />
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
          onCellTooltip={onTokenTableTooltip}
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
              tooltip: true,
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
