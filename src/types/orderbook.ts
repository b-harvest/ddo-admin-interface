import BigNumber from 'bignumber.js'

export interface OrderLCDRaw {
  price: string // '39.535000000000000000'
  user_order_amount: string // '8105733'
  pool_order_amount: string // '0'
}

interface OrderbookLCDRaw {
  price_unit: string
  sells: OrderLCDRaw[]
  buys: OrderLCDRaw[]
}

export interface OrderbooksByPairLCDRaw {
  pair_id: string
  base_price: string // '39.296000000000000000'
  order_books: OrderbookLCDRaw[]
}

export type OrderLCD = {
  price: BigNumber
  user_order_amount: BigNumber
  pool_order_amount: BigNumber
}

export type OrderbookLCD = {
  price_unit: BigNumber
  sells: OrderLCD[]
  buys: OrderLCD[]
}

export type OrderbooksByPair = {
  pair_id: number
  base_price: BigNumber
  order_books: OrderbookLCD[]
}

// chart
export type OrderByPrice = {
  price: BigNumber
  amount: BigNumber
}
