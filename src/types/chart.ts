export type GenericChartEntry = {
  time: number
  value: number
}

export type GenericComposedChartEntry = Omit<GenericChartEntry, 'value'> & {
  [key: string]: number
}

export type ComposedChartEntry = {
  time: number
  value: number
  type: string
}

export type PieChartEntry = {
  type: string | number
  value: number
}
