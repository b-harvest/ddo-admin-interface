export type GenericChartEntry = {
  time: number
  value: number
}

export type ComposedChartEntry = Omit<GenericChartEntry, 'value'> & {
  data: { [key: string]: number }[]
}
