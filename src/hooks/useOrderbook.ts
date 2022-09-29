import BigNumber from 'bignumber.js'
import { useOrderbooksByPairIdLCD } from 'data/useLCD'
import { useCallback, useMemo } from 'react'
import type { DepthByPrice, OrderbooksByPair, OrderLCD, OrderLCDRaw } from 'types/orderbook'
import { PairDetail } from 'types/pair'

const useOrderbook = (pairDetail?: PairDetail, priceUnitPowers = 1, numTicks = 100) => {
  const { data: orderbooksByPairLCDData, isLoading: orderbooksByPairLCDDataLoading } = useOrderbooksByPairIdLCD(
    {
      pairId: pairDetail?.pairId ?? 0,
      priceUnitPowers,
      numTicks,
      fetch: pairDetail !== undefined,
    },
    5000
  )

  const priceUnit = useMemo<BigNumber>(() => {
    const priceUnit = orderbooksByPairLCDData?.pairs[0]?.order_books[0]?.price_unit
    return new BigNumber(priceUnit ?? 0.01)
  }, [orderbooksByPairLCDData])

  const allOrderbooks = useMemo<OrderbooksByPair | undefined>(() => {
    const pair = orderbooksByPairLCDData?.pairs[0]
    if (!pair) return undefined

    const baseExpo = pairDetail?.baseAsset.exponent ?? 0

    return {
      pair_id: Number(pair.pair_id),
      base_price: new BigNumber(pair.base_price),
      order_books: pair.order_books.map((orderbook) => {
        return {
          price_unit: new BigNumber(orderbook.price_unit),
          buys: orderbook.buys.map((buy) => retypeOrder(buy, baseExpo)),
          sells: orderbook.sells.map((sell) => retypeOrder(sell, baseExpo)),
        }
      }),
    }
  }, [orderbooksByPairLCDData, pairDetail])

  const orderbookLastPrice = useMemo<BigNumber | undefined>(
    () => allOrderbooks?.base_price.multipliedBy(10 ** (pairDetail?.diffExpo ?? 0)),
    [allOrderbooks, pairDetail]
  )

  const depthChartData = useMemo<{ sells: DepthByPrice[]; buys: DepthByPrice[] }>(() => {
    const buys =
      allOrderbooks?.order_books.reduce(
        (accm: OrderLCD[], orderbook) => accm.concat(orderbook.buys.slice().reverse()),
        []
      ) ?? []
    const sells =
      allOrderbooks?.order_books.reduce(
        (accm: OrderLCD[], orderbook) => accm.concat(orderbook.sells.slice().reverse()),
        []
      ) ?? []

    const basePrice = allOrderbooks?.base_price
    const dp = Math.abs(priceUnit.e ?? 0)
    const buyStartTick = basePrice?.dp(dp, BigNumber.ROUND_DOWN) ?? new BigNumber(0)
    const sellStartTick = basePrice?.dp(dp, BigNumber.ROUND_UP) ?? new BigNumber(0)

    const buyEndTick = buys[0]?.price ?? new BigNumber(0)
    const sellEndTick = sells.at(-1)?.price ?? new BigNumber(0)
    const buyGap = buyEndTick.minus(buyStartTick).absoluteValue()
    const sellGap = sellEndTick.minus(sellStartTick).absoluteValue()

    const tickCnt = (buyGap.isGreaterThan(sellGap) ? buyGap : sellGap)
      .div(priceUnit)
      .dp(0, BigNumber.ROUND_UP)
      .toNumber()

    const diffExpo = pairDetail?.diffExpo ?? 0

    return {
      buys: mapDepthChartList(buys, priceUnit, tickCnt, buyStartTick, diffExpo, 'buy'),
      sells: mapDepthChartList(sells, priceUnit, tickCnt, sellStartTick, diffExpo, 'sell'),
    }
  }, [allOrderbooks, priceUnit, pairDetail])

  const getDepthCost = useCallback(
    (depth: number) => {
      if (!allOrderbooks) return undefined

      const lastPrice = allOrderbooks.base_price
      const upperBoundPrice = lastPrice.multipliedBy(1 + depth / 100)
      const lowerBoundPrice = lastPrice.multipliedBy(1 - depth / 100)

      const upperBoundOrders = allOrderbooks.order_books.map((orderbook) =>
        orderbook.sells.filter(
          (sell) => sell.price.isLessThanOrEqualTo(upperBoundPrice) && sell.price.isGreaterThanOrEqualTo(lastPrice)
        )
      )

      const lowerBoundOrders = allOrderbooks.order_books.map((orderbook) =>
        orderbook.buys.filter(
          (buy) => buy.price.isGreaterThanOrEqualTo(lowerBoundPrice) && buy.price.isLessThanOrEqualTo(lastPrice)
        )
      )

      const upperDepthCost = upperBoundOrders.reduce((total, orders) => {
        const cost = orders.reduce(
          (accm, order) =>
            accm.plus(
              order.user_order_amount
                .plus(order.pool_order_amount)
                .multipliedBy(order.price)
                .multipliedBy(10 ** (pairDetail?.diffExpo ?? 0))
            ),
          new BigNumber(0)
        )
        return total.plus(cost)
      }, new BigNumber(0))

      const lowerDepthCost = lowerBoundOrders.reduce((total, orders) => {
        const cost = orders.reduce(
          (accm, order) =>
            accm.plus(
              order.user_order_amount
                .plus(order.pool_order_amount)
                .multipliedBy(order.price)
                .multipliedBy(10 ** (pairDetail?.diffExpo ?? 0))
            ),
          new BigNumber(0)
        )
        return total.plus(cost)
      }, new BigNumber(0))

      const quotePriceOracle = pairDetail?.quoteAsset.live?.priceOracle ?? 0
      const upperDepthCostUSD = upperDepthCost.multipliedBy(quotePriceOracle)
      const lowerDepthCostUSD = lowerDepthCost.multipliedBy(quotePriceOracle)

      return {
        upperBoundPrice: upperBoundPrice.multipliedBy(10 ** (pairDetail?.diffExpo ?? 0)),
        lowerBoundPrice: lowerBoundPrice.multipliedBy(10 ** (pairDetail?.diffExpo ?? 0)),
        upperDepthCost,
        lowerDepthCost,
        upperDepthCostUSD,
        lowerDepthCostUSD,
      }
    },
    [allOrderbooks, pairDetail]
  )

  return { orderbooksByPairLCDDataLoading, allOrderbooks, orderbookLastPrice, depthChartData, getDepthCost }
}

export default useOrderbook

function retypeOrder(order: OrderLCDRaw, exponent: number): OrderLCD {
  return {
    price: new BigNumber(order.price),
    user_order_amount: new BigNumber(order.user_order_amount).div(10 ** exponent),
    pool_order_amount: new BigNumber(order.pool_order_amount).div(10 ** exponent),
  }
}

function mapDepthChartList(
  orders: OrderLCD[],
  priceUnit: BigNumber,
  tickCnt: number,
  startTick: BigNumber,
  diffExpo: number,
  type: 'sell' | 'buy'
): DepthByPrice[] {
  const isSell = type === 'sell'

  // get all ticks
  const ticks: BigNumber[] = []
  for (let i = 0; i <= tickCnt; i += 1) {
    if (i === 0) {
      ticks.push(startTick)
    } else {
      const newTick = isSell ? ticks[i - 1].plus(priceUnit) : ticks[i - 1].minus(priceUnit)
      ticks.push(newTick)
    }
  }

  // mapping
  const draftMap = orders
    .map((item) => ({
      price: item.price,
      amount: item.user_order_amount.plus(item.pool_order_amount),
    }))
    .reduce((accm, item) => {
      accm.set(item.price.toString(), item.amount)
      return accm
    }, new Map<string, BigNumber>())

  const drafts = ticks.map((tick) => {
    return {
      price: tick,
      amount: draftMap.get(tick.toString()) ?? new BigNumber(0),
    }
  })

  const depth = drafts.map((item, index) => {
    const prevs: BigNumber[] = []
    for (let i = 0; i < index; i += 1)
      prevs.push(drafts[i].amount.multipliedBy(drafts[i].price).multipliedBy(10 ** diffExpo))

    const prevDepth = prevs.reduce((accm, prev) => accm.plus(prev), new BigNumber(0))
    const currDepth = item.amount
      .multipliedBy(item.price)
      .multipliedBy(10 ** diffExpo)
      .plus(prevDepth)

    return {
      price: item.price.multipliedBy(10 ** diffExpo),
      depth: currDepth,
    }
  })

  return isSell ? depth : depth.slice().reverse()
}
