import BigNumber from 'bignumber.js'
import AppPage from 'components/AppPage'
import Card from 'components/Card'
import IconButton from 'components/IconButton'
import Indicator from 'components/Indicator'
import SelectTab from 'components/SelectTab'
import TableList from 'components/TableList'
import TimestampMemo from 'components/TimestampMemo'
import { useTVLVolUSDUpdate } from 'data/useAPI'
import useChartData from 'hooks/useChartData'
import useOrderbook from 'hooks/useOrderbook'
import usePair from 'hooks/usePair'
import usePool from 'hooks/usePool'
import AssetLogoLabel from 'pages/components/AssetLogoLabel'
import OrderbookDepthChart from 'pages/components/OrderbookDepthChart'
import PoolsTable from 'pages/components/PoolsTable'
import TVLChart from 'pages/components/TVLChart'
import VolumeChart from 'pages/components/VolumeChart'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { PairDetail } from 'types/pair'
import { formatUSDAmount } from 'utils/amount'

enum CHART_TYPE {
  TVL = 'tvl',
  Volume = 'vol',
  Depth = 'depth',
}

export default function Pair() {
  const { id }: { id: string } = useParams()
  const { findPairById } = usePair()
  const pairDetail = findPairById(Number(id))

  const pairLabel = useMemo(
    () =>
      pairDetail
        ? AssetLogoLabel({ assets: pairDetail.assetTickers, nowrap: true, isSingleAssetAutoSpaced: true })
        : null,
    [pairDetail]
  )

  const [isPriceForward, setIsPriceForward] = useState<boolean>(true)
  const onPriceForwardToggle = () => setIsPriceForward(!isPriceForward)

  const price = useMemo<BigNumber | undefined>(() => {
    if (!pairDetail) return undefined
    return isPriceForward
      ? pairDetail.lastPrice
      : new BigNumber(1).div(pairDetail.lastPrice).dp(6, BigNumber.ROUND_DOWN)
  }, [isPriceForward, pairDetail])

  const quoteTicker = useMemo<string | undefined>(() => {
    if (!pairDetail) return undefined
    const baseTicker = pairDetail.baseAsset.ticker
    const quoteTicker = pairDetail.quoteAsset.ticker

    return isPriceForward ? `${quoteTicker}/${baseTicker}` : `${baseTicker}/${quoteTicker}`
  }, [isPriceForward, pairDetail])

  const priceUSD = useMemo<BigNumber | undefined>(() => {
    const priceOracle =
      (isPriceForward ? pairDetail?.quoteAsset.live?.priceOracle : pairDetail?.baseAsset.live?.priceOracle) ?? 0
    return pairDetail && price ? price.multipliedBy(priceOracle) : undefined
  }, [isPriceForward, pairDetail, price])

  // chart
  useTVLVolUSDUpdate()

  const {
    tvlUSDDataTimestamp,
    tvlUSDDataLoading,
    volUSDDataTimestamp,
    tvlUSDChartDataByPools,
    volUSDDataLoading,
    volUSDChartDataByPair,
  } = useChartData()

  const [selectedChart, setSelectedChart] = useState<CHART_TYPE>(CHART_TYPE.Depth)
  const showDepthChart = useMemo<boolean>(() => selectedChart === CHART_TYPE.Depth, [selectedChart])
  const showTVLChart = useMemo<boolean>(() => selectedChart === CHART_TYPE.TVL, [selectedChart])

  const chartTimestamp = useMemo<number | undefined>(
    () => (showDepthChart ? undefined : showTVLChart ? tvlUSDDataTimestamp : volUSDDataTimestamp),
    [showDepthChart, showTVLChart, tvlUSDDataTimestamp, volUSDDataTimestamp]
  )

  // -+2% depth liquidity
  const { orderbooksByPairLCDDataLoading, orderbookLastPrice, depthChartData, getDepthCost } = useOrderbook(pairDetail)
  const depthCost = getDepthCost(2)

  // price tracking table
  const { getAssetTickers } = usePool()
  const priceTableList = useMemo<(PairDetail & { quote: JSX.Element; predDiff: number })[]>(() => {
    return pairDetail
      ? [
          {
            ...pairDetail,
            quote: AssetLogoLabel({
              assets: getAssetTickers(pairDetail.quoteAsset),
              nowrap: true,
              isSingleAssetAutoSpaced: true,
            }),
            predDiff: pairDetail.predPrice.minus(pairDetail.lastPrice).div(pairDetail.predPrice).toNumber() * 100,
          },
        ]
      : []
  }, [pairDetail, getAssetTickers])

  return (
    <AppPage>
      {pairDetail ? (
        <>
          <header className="flex flex-col items-stretch space-y-3 mb-8">
            <div className="flex items-center justify-start space-x-2">
              <div>{pairLabel}</div>
              <div>#{pairDetail.pairId}</div>
            </div>

            <div className="flex items-end gap-x-2 FONT-MONO">
              <div className={`TYPO-BODY-2XL ${isPriceForward ? '' : ' text-pinkCRE'}`} title="Pair price">
                <span>{price ? price.toFormat() : '-'}</span>
                <span className="TYPO-BODY-S"> {quoteTicker}</span>
                <span className="TYPO-BODY-M" style={{ wordBreak: 'keep-all' }} title="Pair price in USD">
                  {' '}
                  (≈{formatUSDAmount({ value: priceUSD, mantissa: 2 })})
                </span>
              </div>
              <IconButton
                type="swap"
                className="-translate-y-1 text-grayCRE-400 hover:text-grayCRE-300 dark:text-grayCRE-200 dark:hover:text-grayCRE-300"
                onClick={onPriceForwardToggle}
              />
            </div>
          </header>

          <div className="flex flex-col md:flex-row items-stretch gap-y-4 md:gap-y-0 md:gap-x-4 mb-20">
            <section className="grow shrink md:grow-0 md:shrink-0 md:basis-[300px] flex flex-col items-stretch gap-y-4">
              <Card
                useGlassEffect={true}
                className={`grow shrink basis-[30%] ${
                  showDepthChart ? 'border border-grayCRE-200 dark:border-grayCRE-400' : ''
                }`}
              >
                <Indicator title="Depth" light={true} className="TYPO-BODY-L !font-bold">
                  <div className="FONT-MONO text-error">
                    <span className="TYPO-BODY-XS mr-2">+2%</span>
                    {formatUSDAmount({ value: depthCost?.upperDepthCostUSD, mantissa: 0 })}
                  </div>
                  <div className="FONT-MONO text-success">
                    <span className="TYPO-BODY-XS mr-2">-2%</span>
                    {formatUSDAmount({ value: depthCost?.lowerDepthCostUSD, mantissa: 0 })}
                  </div>
                </Indicator>
              </Card>
              <Card
                useGlassEffect={true}
                className={`grow shrink basis-[30%] ${
                  showTVLChart ? 'border border-grayCRE-200 dark:border-grayCRE-400' : ''
                }`}
              >
                <Indicator title="TVL" light={true} className="TYPO-BODY-L !font-bold">
                  <div className="FONT-MONO">{formatUSDAmount({ value: pairDetail.tvlUSD, mantissa: 0 })}</div>
                </Indicator>
              </Card>
              <Card
                useGlassEffect={true}
                className={`grow shrink basis-[30%] ${
                  showDepthChart || showTVLChart ? '' : 'border border-grayCRE-200 dark:border-grayCRE-400'
                }`}
              >
                <Indicator title="Trading Volume 24h" light={true} className="TYPO-BODY-L !font-bold">
                  <div className="FONT-MONO">{formatUSDAmount({ value: pairDetail.vol24USD, mantissa: 0 })}</div>
                </Indicator>
              </Card>
            </section>

            <section className="relative grow shrink w-full flex flex-col items-stretch gap-y-2">
              {showDepthChart ? null : (
                <div className="static md:absolute -top-6 right-0 flex justify-start md:flex-end">
                  <TimestampMemo label="Chart last synced" timestamp={chartTimestamp} />
                </div>
              )}
              <div className="relative">
                <SelectTab
                  className="absolute top-4 right-4 z-[2]"
                  selectedValue={selectedChart}
                  onChange={setSelectedChart}
                  tabItems={[
                    { label: 'Depth', value: CHART_TYPE.Depth },
                    { label: 'TVL', value: CHART_TYPE.TVL },
                    { label: 'Volume', value: CHART_TYPE.Volume },
                  ]}
                />
                {showDepthChart ? (
                  <OrderbookDepthChart
                    isLoading={orderbooksByPairLCDDataLoading}
                    basePrice={orderbookLastPrice ?? new BigNumber(0)}
                    priceUnit={`${pairDetail.quoteAsset.ticker}`}
                    quotePriceOracle={pairDetail.quoteAsset.live?.priceOracle ?? new BigNumber(0)}
                    sellChartData={depthChartData.sells}
                    buyChartData={depthChartData.buys}
                    upperBoundPrice={depthCost?.upperBoundPrice}
                    lowerBoundPrice={depthCost?.lowerBoundPrice}
                  />
                ) : showTVLChart ? (
                  <TVLChart
                    isLoading={tvlUSDDataLoading}
                    chartData={tvlUSDChartDataByPools(pairDetail.pools.map((pool) => pool.poolId) ?? [])}
                  />
                ) : (
                  <VolumeChart
                    isLoading={volUSDDataLoading}
                    chartData={volUSDChartDataByPair(Number(id))}
                    translateYTimeTickSelector={true}
                  />
                )}
              </div>
            </section>
          </div>

          {/* -+2% depth liquidity */}
          <section className="mb-20"></section>

          {/* price tracking */}
          <section className="space-y-20">
            <TableList<PairDetail & { quote: JSX.Element; predDiff: number }>
              title="Price tracking"
              useNarrow={true}
              useSearch={false}
              list={priceTableList}
              fields={[
                {
                  label: 'Quote',
                  value: 'quote',
                  type: 'html',
                  widthRatio: 8,
                },
                {
                  label: 'Chage 24h',
                  value: 'change_24',
                  type: 'change',
                  widthRatio: 2,
                  responsive: true,
                  assertThoughResponsive: true,
                },
                {
                  label: 'High 24h',
                  value: 'high_24',
                  type: 'bignumber',
                  toFixedFallback: 6,
                  responsive: true,
                  assertThoughResponsive: true,
                },
                {
                  label: 'Low 24h',
                  value: 'low_24',
                  type: 'bignumber',
                  toFixedFallback: 6,
                  responsive: true,
                  assertThoughResponsive: true,
                },
                {
                  label: 'Last',
                  value: 'lastPrice',
                  type: 'bignumber',
                  toFixedFallback: 6,
                  responsive: true,
                  assertThoughResponsive: true,
                },
                {
                  label: 'Predicted',
                  value: 'predPrice',
                  type: 'bignumber',
                  toFixedFallback: 6,
                  responsive: true,
                  assertThoughResponsive: true,
                },
                {
                  label: 'Last → predicted',
                  value: 'predDiff',
                  type: 'change',
                  responsive: true,
                  assertThoughResponsive: true,
                },
              ]}
            />
            <PoolsTable byPair={pairDetail} title="Pools" />
          </section>
        </>
      ) : null}
    </AppPage>
  )
}
