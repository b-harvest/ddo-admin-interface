import BigNumber from 'bignumber.js'
import AppPage from 'components/AppPage'
import Card from 'components/Card'
import CopyHelper from 'components/CopyHelper'
import H3 from 'components/H3'
import IconButton from 'components/IconButton'
import Indicator from 'components/Indicator'
import PieChart from 'components/PieChart'
import Range from 'components/Range'
import Tag from 'components/Tag'
import TimestampMemo from 'components/TimestampMemo'
import { PINK_CRE, WHITE } from 'constants/style'
import useChartData from 'hooks/useChartData'
import usePool from 'hooks/usePool'
import AssetLogoLabel from 'pages/components/AssetLogoLabel'
import PairsTable from 'pages/components/PairsTable'
import TVLChart from 'pages/components/TVLChart'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PieChartEntry } from 'types/chart'
import { formatUSDAmount } from 'utils/amount'

enum FARMING_STATUS {
  Staked = 'Staked',
  Unfarmed = 'Unfarmed',
}

export default function Pool() {
  const { id }: { id: string } = useParams()

  const { findPoolById } = usePool()
  const poolDetail = findPoolById(Number(id))

  const pairLabel = useMemo(
    () =>
      poolDetail
        ? AssetLogoLabel({ assets: poolDetail.pair.assetTickers, nowrap: true, isSingleAssetAutoSpaced: true })
        : null,
    [poolDetail]
  )

  const [isPriceForward, setIsPriceForward] = useState<boolean>(true)
  const onPriceForwardToggle = () => setIsPriceForward(!isPriceForward)

  const price = useMemo<BigNumber | undefined>(() => {
    if (!poolDetail) return undefined
    return isPriceForward
      ? poolDetail.poolPrice
      : new BigNumber(1).div(poolDetail.poolPrice).dp(6, BigNumber.ROUND_DOWN)
  }, [isPriceForward, poolDetail])

  const quoteTicker = useMemo<string | undefined>(() => {
    if (!poolDetail) return undefined
    const baseTicker = poolDetail.pair.baseAsset.ticker
    const quoteTicker = poolDetail.pair.quoteAsset.ticker

    return isPriceForward ? `${quoteTicker}/${baseTicker}` : `${baseTicker}/${quoteTicker}`
  }, [isPriceForward, poolDetail])

  const priceUSD = useMemo<BigNumber | undefined>(() => {
    const priceOracle =
      (isPriceForward ? poolDetail?.pair.quoteAsset.live?.priceOracle : poolDetail?.pair.baseAsset.live?.priceOracle) ??
      0
    return poolDetail && price ? price.multipliedBy(priceOracle) : undefined
  }, [isPriceForward, poolDetail, price])

  // tvl chart
  const { tvlUSDDataTimestamp, tvlUSDDataLoading, tvlUSDChartDataByPools } = useChartData()

  // pool token farming USD
  // const farmStakedUSD = useMemo<BigNumber | undefined>(
  //   () => poolDetail?.totalStakedAmount.multipliedBy(poolDetail?.priceOracle ?? 0),
  //   [poolDetail]
  // )

  const unfarmedUSD = useMemo<BigNumber | undefined>(() => {
    if (!poolDetail) return undefined
    return poolDetail.totalSupplyAmount.minus(poolDetail.totalStakedAmount).multipliedBy(poolDetail.priceOracle)
  }, [poolDetail])

  // const totalSupplyUSD = useMemo<BigNumber | undefined>(
  //   () => poolDetail?.totalSupplyAmount.multipliedBy(poolDetail?.priceOracle ?? 0),
  //   [poolDetail]
  // )

  // pool token pie chart
  const farmPieChartData = useMemo<PieChartEntry[]>(() => {
    if (!poolDetail) return []
    const staked = poolDetail.totalStakedAmount
    const unfarmed = poolDetail.totalSupplyAmount.minus(staked)

    return [
      { type: 'Staked', value: staked.toNumber() },
      { type: 'Unfarmed', value: unfarmed.toNumber() },
    ]
  }, [poolDetail])

  const farmChartColorMap = {
    Staked: PINK_CRE,
    Unfarmed: WHITE,
  }

  const [farmStatusHover, setFarmStatusHover] = useState<FARMING_STATUS | undefined>()

  const farmAmtHover = useMemo<BigNumber | undefined>(() => {
    if (!poolDetail) return undefined
    switch (farmStatusHover) {
      case FARMING_STATUS.Staked:
        return poolDetail.totalStakedAmount
      case FARMING_STATUS.Unfarmed:
        return poolDetail.totalSupplyAmount.minus(poolDetail.totalStakedAmount)
      default:
        return poolDetail.totalStakedAmount
    }
  }, [farmStatusHover, poolDetail])

  const farmAmtUSDHover = useMemo<BigNumber | undefined>(() => {
    if (!poolDetail) return undefined
    return (farmAmtHover ?? poolDetail.totalStakedAmount).multipliedBy(poolDetail.priceOracle)
  }, [farmAmtHover, poolDetail])

  return (
    <AppPage>
      {poolDetail ? (
        <>
          <header className="flex flex-col items-stretch space-y-3 mb-8">
            <div className="flex items-center justify-start space-x-2">
              <div>{pairLabel}</div>
              <div>#{poolDetail.poolId}</div>
              {poolDetail.isRanged ? <Tag status="strong">Ranged</Tag> : null}
            </div>

            <div className="flex items-end gap-x-2 FONT-MONO">
              <div className={`TYPO-BODY-2XL ${isPriceForward ? '' : ' text-pinkCRE'}`} title="Pair price">
                <span>{price ? price.dp(6, BigNumber.ROUND_DOWN).toFormat() : '-'}</span>
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

          <div className="flex flex-col md:flex-row items-stretch gap-y-10 md:gap-y-0 md:gap-x-4 mb-20">
            <section className="grow shrink md:grow-0 md:shrink-0 md:basis-[300px] flex flex-col items-stretch gap-y-4">
              <Card useGlassEffect={true} className={`grow shrink basis-[30%]`}>
                <Indicator title="TVL" light={true} className="TYPO-BODY-L !font-bold">
                  <div className="FONT-MONO">{formatUSDAmount({ value: poolDetail.tvlUSD, mantissa: 0 })}</div>
                </Indicator>
              </Card>
              <Card useGlassEffect={true} className={`grow shrink basis-[30%]`}>
                <Indicator title="APR" light={true} className="TYPO-BODY-L !font-bold">
                  <div className="FONT-MONO">{poolDetail.apr.toFixed(2)}%</div>
                </Indicator>
              </Card>
              <Card useGlassEffect={true} className={`grow shrink basis-[30%]`}>
                <Indicator title="Price range" light={true} className="TYPO-BODY-L !font-bold">
                  {poolDetail.isRanged ? (
                    <div className="w-full pt-2">
                      <Range min={poolDetail.minPrice} max={poolDetail.maxPrice} current={poolDetail.poolPrice} />
                    </div>
                  ) : (
                    '-'
                  )}
                </Indicator>
              </Card>
            </section>

            <section className="relative grow shrink w-full flex flex-col items-stretch gap-y-2">
              <div className="static md:absolute -top-6 right-0 flex justify-start md:flex-end">
                <TimestampMemo label="Chart last synced" timestamp={tvlUSDDataTimestamp} />
              </div>
              <div className="relative">
                <TVLChart isLoading={tvlUSDDataLoading} chartData={tvlUSDChartDataByPools([poolDetail.poolId])} />
              </div>
            </section>
          </div>

          {/* pool token farming */}
          <section className="mb-20">
            <div className="flex items-center gap-x-2 mb-4">
              <H3 title="Pool Token" className="" />
              <span>
                <CopyHelper toCopy={poolDetail.poolDenom} iconPosition="left">
                  ({poolDetail.poolDenom})
                </CopyHelper>
              </span>
            </div>

            <div className="mb-2">
              <span className="TYPO-BODY-XS">Price: </span>
              <span className="FONT-MONO">{formatUSDAmount({ value: poolDetail.priceOracle, mantissa: 2 })}</span>
            </div>
            <div className="flex flex-col md:flex-row gap-y-4 md:gap-x-4 items-stretch">
              <div className="grow shrink md:grow-0 md:shrink-0 md:basis-[300px] flex flex-col items-stretch gap-y-4">
                <Card useGlassEffect={true} className={`grow shrink basis-[30%]`}>
                  <Indicator title="Farm staked" light={true} className="TYPO-BODY-L !font-bold">
                    <div className="flex items-center gap-x-3 FONT-MONO">
                      {formatUSDAmount({ value: poolDetail.farmStakedUSD, mantissa: 2 })}
                      <Tag status="info">{poolDetail.farmStakedRate}%</Tag>
                    </div>
                  </Indicator>
                </Card>
                <Card useGlassEffect={true} className={`grow shrink basis-[30%]`}>
                  <Indicator title="Unfarmed" light={true} className="TYPO-BODY-L !font-bold">
                    <div className="flex items-center gap-x-3 FONT-MONO">
                      {formatUSDAmount({ value: unfarmedUSD, mantissa: 2 })}
                      <Tag status="white">{poolDetail.unfarmedRate.toFixed(1)}%</Tag>
                    </div>
                  </Indicator>
                </Card>
                <Card useGlassEffect={true} className={`grow shrink basis-[30%]`}>
                  <Indicator title="Total supply" light={true} className="TYPO-BODY-L !font-bold">
                    <div className="flex items-center gap-x-3 FONT-MONO">
                      {formatUSDAmount({ value: poolDetail.totalSupplyUSD, mantissa: 2 })}
                    </div>
                  </Indicator>
                </Card>
              </div>

              <PieChart
                className="grow shrink w-full"
                data={farmPieChartData}
                colorMap={farmChartColorMap}
                label={farmStatusHover}
                setLabel={(label: string | undefined) => setFarmStatusHover(label as FARMING_STATUS | undefined)}
                topLeft={
                  <Indicator title="Farming ratio" light={true} label={farmStatusHover ?? 'Staked'}>
                    <div className="flex flex-col items-start gap-y-1 TYPO-BODY-XL !font-black FONT-MONO">
                      <div>{farmAmtHover?.toFormat()}</div>
                      <div className="!TYPO-BODY-S">(≈{formatUSDAmount({ value: farmAmtUSDHover, mantissa: 2 })})</div>
                    </div>
                  </Indicator>
                }
              />
            </div>
          </section>

          {/* pair */}
          <section className="">
            <PairsTable byPool={poolDetail} title="Pair" />
          </section>
        </>
      ) : null}
    </AppPage>
  )
}
