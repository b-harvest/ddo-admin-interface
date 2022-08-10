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

  // tvl total
  const [priceHover, setPriceHover] = useState<number | undefined>()
  const [orderAmtHover, setOrderAmtHover] = useState<number | undefined>()

  const headPrice = useMemo<number>(() => priceHover ?? basePrice.toNumber(), [priceHover, basePrice])

  const headAmt = useMemo<BigNumber>(() => {
    const depthUSD = (
      orderAmtHover && priceHover
        ? new BigNumber(orderAmtHover).multipliedBy(priceHover)
        : depthChartList
            .find((item) => item.time === basePrice.toNumber())
            ?.origin.depth.multipliedBy(basePrice.toNumber()) ?? new BigNumber(0)
    ).multipliedBy(quotePriceOracle)
    return depthUSD
  }, [priceHover, orderAmtHover, depthChartList, quotePriceOracle, basePrice])

  const depthSide = useMemo<string | undefined>(() => {
    if (sellChartList.find((item) => item.time === headPrice)) return 'sell'
    if (buyChartList.find((item) => item.time === headPrice)) return 'buy'
    return undefined
  }, [buyChartList, sellChartList, headPrice])

  const headAmtCSS = useMemo<string>(() => {
    switch (depthSide) {
      case 'sell':
        return 'text-error'
      case 'buy':
        return 'text-success'
      default:
        return ''
    }
  }, [depthSide])

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
        value={orderAmtHover}
        setValue={setOrderAmtHover}
        label={priceHover}
        setLabel={setPriceHover}
        onClick={handleClick}
        topLeft={
          <>
            <AmountOfDate
              title="Depth"
              value={headAmt}
              valueCSS={headAmtCSS}
              dateLabel={`${headPrice.toString()} ${priceUnit}`}
              hideAbbr={true}
              className="mb-4"
            />
          </>
        }
      ></TwoLineChart>
    </>
  )
}
