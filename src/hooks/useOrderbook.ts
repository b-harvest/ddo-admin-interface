import BigNumber from 'bignumber.js'
import { useOrderbooksByPairIdLCD } from 'data/useLCD'
import { useCallback, useMemo } from 'react'
import type { DepthByPrice, OrderbooksByPair, OrderLCD, OrderLCDRaw } from 'types/orderbook'
import { PairDetail } from 'types/pair'

const useOrderbook = (pairDetail?: PairDetail, priceUnitPowers = 0, numTicks = 1000) => {
  const { data: orderbooksByPairLCDData, isLoading: orderbooksByPairLCDDataLoading } = useOrderbooksByPairIdLCD(
    {
      pairId: pairDetail?.pairId ?? 0,
      priceUnitPowers,
      numTicks,
      fetch: pairDetail !== undefined,
    },
    5000
  )

  const allOrderbooks = useMemo<OrderbooksByPair | undefined>(() => {
    const pair = orderbooksByPairLCDData?.pairs[0]
    if (!pair) return undefined

    return {
      pair_id: Number(pair.pair_id),
      base_price: new BigNumber(pair.base_price),
      order_books: pair.order_books.map((orderbook) => {
        const baseExpo = pairDetail?.baseAsset.exponent ?? 0
        return {
          price_unit: new BigNumber(orderbook.price_unit),
          buys: orderbook.buys.map((buy) => retypeOrder(buy, baseExpo)),
          sells: orderbook.sells.map((sell) => retypeOrder(sell, baseExpo)),
        }
      }),
    }
  }, [orderbooksByPairLCDData, pairDetail])

  const orderbookLastPrice = useMemo<BigNumber | undefined>(() => allOrderbooks?.base_price, [allOrderbooks])

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

    return {
      sells: mapDepthChartList(sells, 'sell'),
      buys: mapDepthChartList(buys, 'buy'),
    }
  }, [allOrderbooks])

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
          (accm, order) => accm.plus(order.user_order_amount.plus(order.pool_order_amount).multipliedBy(order.price)),
          new BigNumber(0)
        )
        return total.plus(cost)
      }, new BigNumber(0))

      const lowerDepthCost = lowerBoundOrders.reduce((total, orders) => {
        const cost = orders.reduce(
          (accm, order) => accm.plus(order.user_order_amount.plus(order.pool_order_amount).multipliedBy(order.price)),
          new BigNumber(0)
        )
        return total.plus(cost)
      }, new BigNumber(0))

      const quotePriceOracle = pairDetail?.quoteAsset.live?.priceOracle ?? 0
      const upperDepthCostUSD = upperDepthCost.multipliedBy(quotePriceOracle)
      const lowerDepthCostUSD = lowerDepthCost.multipliedBy(quotePriceOracle)

      return {
        upperBoundPrice,
        lowerBoundPrice,
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

function mapDepthChartList(orders: OrderLCD[], type: 'sell' | 'buy'): DepthByPrice[] {
  const isSell = type === 'sell'
  const draft = isSell ? orders : orders.slice().reverse()

  const mapped = draft.map((item, index) => {
    const prevs: BigNumber[] = []
    for (let i = 0; i < index; i += 1)
      prevs.push(draft[i].user_order_amount.plus(draft[i].pool_order_amount).multipliedBy(draft[i].price))

    const prevDepth = prevs.reduce((accm, prev) => accm.plus(prev), new BigNumber(0))
    const currDepth = {
      price: item.price,
      depth: item.user_order_amount.plus(item.pool_order_amount).multipliedBy(item.price).plus(prevDepth),
    }

    return currDepth
  })

  return isSell ? mapped : mapped.slice().reverse()
}
