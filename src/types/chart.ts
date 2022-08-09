export type GenericChartEntry = {
  time: number
  value: number
}

export type GenericTwoChartEntry = Omit<GenericChartEntry, 'value'> & {
  time: number
  value1?: number
  value2?: number
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
