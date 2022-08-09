import BigNumber from 'bignumber.js'
import AmountOfDate from 'components/AmountOfDate'
import TwoLineChart from 'components/TwoLineChart'
import { ERROR, SUCCESS } from 'constants/style'
import { useMemo, useState } from 'react'
import type { GenericTwoChartEntry } from 'types/chart'
import type { OrderByPrice } from 'types/orderbook'

export default function OrderbookDepthChart({
  isLoading,
  sellChartData,
  buyChartData,
  basePrice,
  priceOracle,
  lowerBoundPrice,
  upperBoundPrice,
  onClick,
}: {
  isLoading: boolean
  sellChartData: OrderByPrice[]
  buyChartData: OrderByPrice[]
  basePrice: BigNumber
  priceOracle: BigNumber
  lowerBoundPrice?: BigNumber
  upperBoundPrice?: BigNumber
  onClick?: (price: OrderByPrice | undefined) => void
}) {
  // chart data
  const depthChartList = useMemo<(GenericTwoChartEntry & { origin: OrderByPrice })[]>(() => {
    const buyList = buyChartData.map((item) => {
      return {
        time: item.price.toNumber(),
        value1: undefined,
        value2: item.amount.toNumber(),
        origin: item,
      }
    })
    const sellList = sellChartData.map((item) => {
      return {
        time: item.price.toNumber(),
        value1: item.amount.toNumber(),
        value2: undefined,
        origin: item,
      }
    })
    return [...buyList, ...sellList]
  }, [sellChartData, buyChartData])

  // tvl total
  const [orderAmtHover, setOrderAmtHover] = useState<number | undefined>()
  const [priceHover, setPriceHover] = useState<number | undefined>()

  const headLabel = useMemo<number>(() => priceHover ?? basePrice.toNumber(), [priceHover, basePrice])
  const headAmt = useMemo(() => {
    return (
      orderAmtHover
        ? new BigNumber(orderAmtHover)
        : depthChartList.find((item) => item.time === headLabel)?.origin.amount ?? new BigNumber(0)
    ).multipliedBy(priceOracle)
  }, [orderAmtHover, depthChartList, headLabel, priceOracle])

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
              title="Order amount"
              value={headAmt}
              dateLabel={headLabel.toString()}
              hideAbbr={true}
              className="mb-4"
            />
          </>
        }
      ></TwoLineChart>
    </>
  )
}
