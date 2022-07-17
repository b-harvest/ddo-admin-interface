import { LIGHT_CRE } from 'constants/style'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { HTMLAttributes, ReactNode, useCallback, useMemo } from 'react'
import { Bar, BarChart as Chart, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import type { GenericChartEntry } from 'types/chart'

dayjs.extend(utc)
dayjs.extend(weekOfYear)

const DEFAULT_HEIGHT = 300

export enum TimeTick {
  Daily,
  Weekly,
  Monthly,
}

export type LineChartProps = {
  data: GenericChartEntry[]
  color?: string | undefined
  height?: number | undefined
  minHeight?: number
  setValue?: (value: number | undefined) => void
  setLabel?: (value: string | undefined) => void
  value?: number
  label?: string
  chartTimeTick?: TimeTick
  topLeft?: ReactNode | undefined
  topRight?: ReactNode | undefined
  bottomLeft?: ReactNode | undefined
  bottomRight?: ReactNode | undefined
  className?: string
} & HTMLAttributes<HTMLDivElement>

export default function BarChart({
  data,
  color = '#56B2A4',
  setValue,
  setLabel,
  value,
  label,
  chartTimeTick,
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
  minHeight = DEFAULT_HEIGHT,
  className = '',
  ...rest
}: LineChartProps) {
  const parsedValue = value

  const now = dayjs()

  const timeTickedChartData = useCallback((chartData: GenericChartEntry[], type: TimeTick) => {
    if (!chartData) return []

    const data: Record<string, GenericChartEntry> = {}

    chartData.forEach(({ time, value }: GenericChartEntry) => {
      const tickType = unixToType(time, type)
      if (data[tickType]) {
        data[tickType].value += value
      } else {
        data[tickType] = {
          time,
          value,
        }
      }
    })

    return Object.values(data)
  }, [])

  const chartData: GenericChartEntry[] = useMemo(
    () => timeTickedChartData(data, chartTimeTick ?? TimeTick.Daily),
    [data, timeTickedChartData, chartTimeTick]
  )

  return (
    <div
      className={`${className} flex flex-col w-full bg-neutral-900 p-4 rounded-xl dark:bg-neutral-800`}
      style={{
        minWidth: '0',
        height: `${minHeight}px`,
        minHeight: `${minHeight}px`,
      }}
      {...rest}
    >
      <div className="shrink-0 grow-0 flex justify-between">
        {topLeft ?? null}
        {topRight ?? null}
      </div>

      <div className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <Chart
            width={400}
            height={220}
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            onMouseLeave={() => {
              setLabel && setLabel(undefined)
              setValue && setValue(undefined)
            }}
          >
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tickFormatter={(time) => dayjs(time).format(chartTimeTick === TimeTick.Monthly ? 'MMM' : 'DD')}
              minTickGap={10}
            />
            <Tooltip
              cursor={{ fill: LIGHT_CRE }}
              contentStyle={{ display: 'none' }}
              formatter={(
                value: GenericChartEntry['value'],
                name: string,
                props: { payload: { time: GenericChartEntry['time']; value: GenericChartEntry['value'] } }
              ) => {
                if (setValue && parsedValue !== props.payload.value) {
                  setValue(props.payload.value)
                }
                const formattedTime = dayjs(props.payload.time).format('MMM D')
                const formattedTimeDaily = dayjs(props.payload.time).format('MMM D YYYY')
                const formattedTimePlusWeek = dayjs(props.payload.time).add(1, 'week')
                const formattedTimePlusMonth = dayjs(props.payload.time).add(1, 'month')

                if (setLabel && label !== formattedTime) {
                  if (chartTimeTick === TimeTick.Weekly) {
                    const isCurrent = formattedTimePlusWeek.isAfter(now)
                    setLabel(
                      formattedTime + '-' + (isCurrent ? 'current' : formattedTimePlusWeek.format('MMM D, YYYY'))
                    )
                  } else if (chartTimeTick === TimeTick.Monthly) {
                    const isCurrent = formattedTimePlusMonth.isAfter(now)
                    setLabel(
                      formattedTime + '-' + (isCurrent ? 'current' : formattedTimePlusMonth.format('MMM D, YYYY'))
                    )
                  } else {
                    setLabel(formattedTimeDaily)
                  }
                }
              }}
            />
            <Bar
              dataKey="value"
              fill={color}
              shape={(props) => {
                return <CustomBar height={props.height} width={props.width} x={props.x} y={props.y} fill={color} />
              }}
            />
          </Chart>
        </ResponsiveContainer>
      </div>

      <div className="shrink-0 grow-0 flex justify-between">
        {bottomLeft ?? null}
        {bottomRight ?? null}
      </div>
    </div>
  )
}

function CustomBar({
  x,
  y,
  width,
  height,
  fill,
}: {
  x: number
  y: number
  width: number
  height: number
  fill: string
}) {
  return (
    <g>
      <rect x={x} y={y} fill={fill} width={width} height={height} rx="2" />
    </g>
  )
}

function unixToType(time: number, type: TimeTick) {
  const day = dayjs(time)

  switch (type) {
    case TimeTick.Monthly:
      return day.format('YYYY-MM')
    case TimeTick.Weekly:
      let week = String(day.week())
      if (week.length === 1) {
        week = `0${week}`
      }
      return `${day.year()}-${week}`
    default:
      return day.format('YYYY-MM-DD')
  }
}
