import BigNumber from 'bignumber.js'
import AppPage from 'components/AppPage'
import LineChart from 'components/LineChart'
import chartData from 'components/LineChart/dummy/data.json'
import TableList from 'components/TableList'
import dayjs from 'dayjs'
import useAsset from 'hooks/useAsset'
import usePair from 'hooks/usePair'
import AssetTableCell from 'pages/components/AssetTableCell'
import { useMemo, useState } from 'react'
import { formatUSDAmount } from 'utils/amount'

export default function Asset() {
  const { tvlUSD, getTVLUSDbyDenom, getVol24USDbyDenom } = usePair()

  // chart
  const [tvlHover, setTvlHover] = useState<number | undefined>()
  const [tvlTimeLabelHover, setTvlTimeLabelHover] = useState<number | undefined>()

  const tvlChartHeadAmt = useMemo(() => {
    return tvlHover ? new BigNumber(tvlHover) : tvlUSD
  }, [tvlHover, tvlUSD])

  const tvlChartList = useMemo(() => {
    type DexDataByDay = { id: string; date: number; tvlUSD: string; volumeUSD: string }
    const {
      data: { uniswapDayDatas },
    } = chartData as { data: { uniswapDayDatas: DexDataByDay[] } }

    if (!uniswapDayDatas) return []

    return uniswapDayDatas.map((day) => {
      return {
        time: day.date * 1000,
        value: Number(new BigNumber(day.tvlUSD).toFixed(0)),
      }
    })
  }, [])

  // console.log('tvlChartList', tvlChartList)

  // asset table
  const { allAsset } = useAsset()
  // console.log('allAsset', allAsset)

  const assetTableList = useMemo(() => {
    return allAsset.map((item, index) => {
      const asset = AssetTableCell({ logoUrl: item.logoUrl, ticker: item.ticker })
      const vol24USD = getVol24USDbyDenom(item.denom, item.exponent)
      const tvlUSD = getTVLUSDbyDenom(item.denom)
      const priceOracle = item.live ? new BigNumber(item.live.priceOracle) : null

      return {
        index,
        asset,
        chainName: item.chainName,
        priceOracle,
        vol24USD,
        tvlUSD,
        exponent: item.exponent,
      }
    })
  }, [allAsset, getTVLUSDbyDenom, getVol24USDbyDenom])

  return (
    <AppPage>
      <section className="flex flex-col justify-between items-center space-y-4 mb-8 md:flex-row md:space-x-4 md:space-y-0">
        {/* className="shrink grow basis-auto" */}
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
          title="Asset List"
          useSearch={true}
          useNarrow={true}
          list={assetTableList}
          defaultSortBy="tvlUSD"
          defaultIsSortASC={false}
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
      <div className="TYPO-BODY-M !font-medium mb-2">TVL</div>
      <div className="flex flex-col justify-start items-start space-y-2">
        <div className="TYPO-BODY-XL !font-black font-mono">
          {`$${value.toFormat(0)} (${formatUSDAmount(value, 2)})`}
        </div>
        <div className="TYPO-BODY-XS !font-medium">{dateLabel}</div>
      </div>
    </div>
  )
}
