import BigNumber from 'bignumber.js'
import AmountOfDate from 'components/AmountOfDate'
import TwoLineChart from 'components/TwoLineChart'
import { ERROR, SUCCESS } from 'constants/style'
import { useMemo, useState } from 'react'
import type { GenericTwoChartEntry } from 'types/chart'
import type { DepthByPrice } from 'types/orderbook'

export default function OrderbookDepthChart({
  isLoading,
  sellChartData,
  buyChartData,
  basePrice,
  priceUnit,
  quotePriceOracle,
  lowerBoundPrice,
  upperBoundPrice,
  onClick,
}: {
  isLoading: boolean
  sellChartData: DepthByPrice[]
  buyChartData: DepthByPrice[]
  basePrice: BigNumber
  priceUnit?: string
  quotePriceOracle: BigNumber
  lowerBoundPrice?: BigNumber
  upperBoundPrice?: BigNumber
  onClick?: (price: DepthByPrice | undefined) => void
}) {
  // chart data
  const buyChartList = useMemo<(GenericTwoChartEntry & { origin: DepthByPrice })[]>(() => {
    return buyChartData.map((item) => {
      return {
        time: item.price.toNumber(),
        value1: undefined,
        value2: item.depth.toNumber(),
        origin: item,
      }
    })
  }, [buyChartData])

  const sellChartList = useMemo<(GenericTwoChartEntry & { origin: DepthByPrice })[]>(() => {
    return sellChartData.map((item) => {
      return {
        time: item.price.toNumber(),
        value1: item.depth.toNumber(),
        value2: undefined,
        origin: item,
      }
    })
  }, [sellChartData])

  const depthChartList = useMemo<(GenericTwoChartEntry & { origin: DepthByPrice })[]>(
    () => [...buyChartList, ...sellChartList],
    [buyChartList, sellChartList]
  )

  // price hover
  const [priceHover, setPriceHover] = useState<number | undefined>()

  const headPrice = useMemo<number>(() => priceHover ?? basePrice.toNumber(), [priceHover, basePrice])

  const headPriceDiffRate = useMemo<BigNumber | undefined>(() => {
    const originPriceHover = depthChartList.find((item) => item.time === priceHover)?.origin.price
    return originPriceHover ? originPriceHover.minus(basePrice).div(basePrice).multipliedBy(100) : undefined
  }, [depthChartList, priceHover, basePrice])

  const headPriceLabel = useMemo<string>(() => {
    const rate = headPriceDiffRate
      ? `(${headPriceDiffRate.dp(2, BigNumber.ROUND_HALF_UP).toNumber()}%)`
      : `(Base price)`
    return `${headPrice.toString()} ${priceUnit} ${rate}`
  }, [headPrice, headPriceDiffRate, priceUnit])

  const headAmt = useMemo<BigNumber | undefined>(() => {
    const depthHover = depthChartList.find((item) => item.time === headPrice)?.origin.depth
    return depthHover?.multipliedBy(quotePriceOracle)
  }, [headPrice, depthChartList, quotePriceOracle])

  const handleClick = (price: number | undefined) => {
    const order = depthChartList.find((item) => item.time === price)?.origin
    if (onClick) onClick(order)
  }

  return (
    <>
      <TwoLineChart
        isLoading={isLoading}
        height={220}
        minHeight={360}
        color1={ERROR}
        color2={SUCCESS}
        time1={upperBoundPrice?.toNumber()}
        time2={lowerBoundPrice?.toNumber()}
        data={depthChartList}
        highlightTime={basePrice.toNumber()}
        label={priceHover}
        setLabel={setPriceHover}
        onClick={handleClick}
        topLeft={
          <AmountOfDate title="Depth" value={headAmt} dateLabel={headPriceLabel} hideAbbr={true} className="mb-4" />
        }
      ></TwoLineChart>
    </>
  )
}
