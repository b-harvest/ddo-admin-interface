import Card, { CardMergedSide } from 'components/Card'
import { LIGHT_CRE_O, PINK_CRE } from 'constants/style'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { HTMLAttributes, ReactNode, useCallback, useMemo } from 'react'
import { Bar, BarChart as Chart, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import { CategoricalChartState } from 'recharts/types/chart/generateCategoricalChart'
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
  highlightTime?: GenericChartEntry['time']
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
  cardMerged?: CardMergedSide
  onClick?: (time: number | undefined) => void
} & Omit<HTMLAttributes<HTMLDivElement>, 'onClick'>

export default function BarChart({
  data,
  highlightTime,
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
  cardMerged,
  onClick,
  ...rest
}: LineChartProps) {
  // const parsedValue = value

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

  const handleMouseOn = useCallback(
    (props: CategoricalChartState) => {
      // value
      if (setValue && props.activePayload && value !== props.activePayload[0]?.payload?.value) {
        setValue(props.activePayload[0]?.payload?.value)
      }

      // label

      if (setLabel && props.isTooltipActive && label !== props.activeLabel) {
        const now = dayjs()
        const formattedTime = dayjs(props.activeLabel).format('MMM D')
        const formattedTimeDaily = dayjs(props.activeLabel).format('MMM D YYYY')
        const formattedTimePlusWeek = dayjs(props.activeLabel).add(1, 'week')
        const formattedTimePlusMonth = dayjs(props.activeLabel).add(1, 'month')

        if (setLabel && label !== formattedTime) {
          if (chartTimeTick === TimeTick.Weekly) {
            const isCurrent = formattedTimePlusWeek.isAfter(now)
            setLabel(formattedTime + '-' + (isCurrent ? 'current' : formattedTimePlusWeek.format('MMM D, YYYY')))
          } else if (chartTimeTick === TimeTick.Monthly) {
            const isCurrent = formattedTimePlusMonth.isAfter(now)
            setLabel(formattedTime + '-' + (isCurrent ? 'current' : formattedTimePlusMonth.format('MMM D, YYYY')))
          } else if (chartTimeTick) {
            setLabel(formattedTimeDaily)
          } else {
            setLabel(props.activeLabel)
          }
        }
      }
    },
    [setValue, value, setLabel, label, chartTimeTick]
  )

  const handleMouseLeave = useCallback(() => {
    setLabel && setLabel(undefined)
    setValue && setValue(undefined)
  }, [setLabel, setValue])

  const handleClick = useCallback(
    (props: CategoricalChartState) => {
      if (onClick) onClick(props.activeLabel as number | undefined)
    },
    [onClick]
  )

  return (
    <Card
      className={`${className} w-full`}
      useGlassEffect={true}
      merged={cardMerged}
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
            data={chartTimeTick !== undefined ? chartData : data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            onMouseEnter={handleMouseOn}
            onMouseMove={handleMouseOn}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
          >
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tickFormatter={(time) =>
                chartTimeTick !== undefined ? dayjs(time).format(chartTimeTick === TimeTick.Monthly ? 'MMM' : 'DD') : ''
              }
              minTickGap={10}
            />
            <Tooltip cursor={{ fill: LIGHT_CRE_O }} contentStyle={{ display: 'none' }} />
            <Bar
              dataKey="value"
              fill={color}
              shape={(props) => (
                <CustomBar
                  height={props.height}
                  width={props.width}
                  x={props.x}
                  y={props.y}
                  fill={props.time === highlightTime ? PINK_CRE : color}
                  cursor={onClick ? 'pointer' : 'default'}
                />
              )}
            />
          </Chart>
        </ResponsiveContainer>
      </div>

      <div className="shrink-0 grow-0 flex justify-between">
        {bottomLeft ?? null}
        {bottomRight ?? null}
      </div>
    </Card>
  )
}

function CustomBar({
  x,
  y,
  width,
  height,
  fill,
  cursor,
}: {
  x: number
  y: number
  width: number
  height: number
  fill: string
  cursor?: string
}) {
  return (
    <g>
      <rect x={x} y={y} fill={fill} width={width} height={height} rx="2" cursor={cursor} />
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
