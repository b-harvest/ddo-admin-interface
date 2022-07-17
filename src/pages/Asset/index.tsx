import BigNumber from 'bignumber.js'
import AppPage from 'components/AppPage'
import GlowBackground from 'components/GlowBackground'
import LineChart from 'components/LineChart'
import chartData from 'components/LineChart/dummy/data.json'
import TableList from 'components/TableList'
import dayjs from 'dayjs'
import useAsset from 'hooks/useAsset'
import usePair from 'hooks/usePair'
import usePool from 'hooks/usePool'
import AssetTableLogoCell from 'pages/components/AssetTableLogoCell'
import { useMemo, useState } from 'react'
import type { GenericChartEntry } from 'types/chart'
import { formatBigUSDAmount } from 'utils/amount'

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

export default function Asset() {
  const { allAsset } = useAsset()
  const { findPoolFromPairsByDenom, tvlUSD, getTVLUSDbyDenom, getVol24USDbyDenom, getAssetTickers } = usePair()
  const { findPoolByDenom } = usePool()

  // chart
  const [tvlHover, setTvlHover] = useState<number | undefined>()
  const [tvlTimeLabelHover, setTvlTimeLabelHover] = useState<number | undefined>()

  const tvlChartHeadAmt = useMemo(() => {
    return tvlHover ? new BigNumber(tvlHover) : tvlUSD
  }, [tvlHover, tvlUSD])

  const tvlChartList: GenericChartEntry[] = useMemo(() => {
    type DexDailyData = { id: string; date: number; tvlUSD: string; volumeUSD: string }
    const {
      data: { uniswapDayDatas },
    } = chartData as { data: { uniswapDayDatas: DexDailyData[] } }

    if (!uniswapDayDatas) return []

    return uniswapDayDatas.map((data) => {
      return {
        time: data.date * 1000,
        value: Number(new BigNumber(data.tvlUSD).toFixed(0)),
      }
    })
  }, [])

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
      <GlowBackground
        style={{
          transform: 'translateY(-150vh) translateX(-50vw)',
        }}
      />
      <GlowBackground
        style={{
          transform: 'translateY(25vh) translateX(75vw)',
        }}
      />
      <section className="flex flex-col justify-between items-center space-y-4 mb-8 md:flex-row md:space-x-4 md:space-y-0">
        {/* className="dark:shadow-glow-wide-d" */}
        <LineChart
          height={220}
          minHeight={360}
          data={tvlChartList}
          value={tvlHover}
          setValue={setTvlHover}
          label={tvlTimeLabelHover}
          setLabel={setTvlTimeLabelHover}
          topLeft={
            <AmountUSD
              className="mb-4"
              value={tvlChartHeadAmt}
              dateLabel={dayjs(tvlTimeLabelHover).format('MMM DD, YYYY')}
            />
          }
        ></LineChart>
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

function AmountUSD({
  value,
  dateLabel,
  light = true,
  className = '',
}: {
  value: BigNumber
  dateLabel: string
  light?: boolean
  className?: string
}) {
  return (
    <div className={`${light ? 'text-white' : 'text-black'} text-left ${className}`}>
      <div
        className={`${
          light ? 'text-grayCRE-300 dark:text-grayCRE-400' : 'text-grayCRE-400-o'
        } TYPO-BODY-M !font-medium mb-2`}
      >
        TVL
      </div>
      <div className="flex flex-col justify-start items-start space-y-2">
        <div className="TYPO-BODY-XL !font-black font-mono">
          {`$${value.toFormat(0)}`}
          <span className="hidden ml-2 md:inline-block">{`(${formatBigUSDAmount(value, 2)})`}</span>
        </div>
        <div className="TYPO-BODY-XS !font-medium">{dateLabel}</div>
      </div>
    </div>
  )
}
