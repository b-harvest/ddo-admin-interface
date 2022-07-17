export type GenericChartEntry = {
  time: number
  value: number
}

export type ComposedChartEntry = Omit<GenericChartEntry, 'value'> & {
  [key: string]: number
}
