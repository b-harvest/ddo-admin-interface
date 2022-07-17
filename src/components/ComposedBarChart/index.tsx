import { LIGHT_CRE } from 'constants/style'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { HTMLAttributes, ReactNode } from 'react'
import { Bar, BarChart as Chart, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import type { ComposedChartEntry } from 'types/chart'

dayjs.extend(utc)
dayjs.extend(weekOfYear)

const DEFAULT_HEIGHT = 300

// export enum TimeTick {
//   Daily,
//   Weekly,
//   Monthly,
// }

export type LineChartProps = {
  data: ComposedChartEntry[]
  color?: string | undefined
  height?: number | undefined
  minHeight?: number
  setValue?: (value: number | undefined) => void
  setLabel?: (value: string | undefined) => void
  value?: number
  label?: string
  tickFormatter?: (tick: ComposedChartEntry['time']) => string
  topLeft?: ReactNode | undefined
  topRight?: ReactNode | undefined
  bottomLeft?: ReactNode | undefined
  bottomRight?: ReactNode | undefined
  className?: string
} & HTMLAttributes<HTMLDivElement>

export default function ComposedBarChart({
  data,
  color = '#56B2A4',
  setValue,
  setLabel,
  value,
  label,
  tickFormatter,
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
  minHeight = DEFAULT_HEIGHT,
  className = '',
  ...rest
}: LineChartProps) {
  const parsedValue = value

  // const now = dayjs()

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
            data={data}
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
              tickFormatter={tickFormatter ?? ((time) => time)}
              minTickGap={10}
            />
            <Tooltip
              cursor={{ fill: LIGHT_CRE }}
              contentStyle={{ display: 'none' }}
              formatter={(
                value: ComposedChartEntry['data'],
                name: string,
                props: { payload: { time: ComposedChartEntry['time']; value: ComposedChartEntry['data'] } }
              ) => {
                if (setValue && parsedValue !== props.payload.time) {
                  setValue(props.payload.time)
                }
                const formattedTime = dayjs(props.payload.time).format('MMM D')

                if (setLabel && label !== formattedTime) {
                  setLabel(formattedTime)
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
