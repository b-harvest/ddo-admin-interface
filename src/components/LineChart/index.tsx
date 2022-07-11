import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { darken } from 'polished'
import { HTMLAttributes, ReactNode } from 'react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
dayjs.extend(utc)

const DEFAULT_HEIGHT = 300
const LIGHT_CRE = '#FFFAF4'
const DARK_CRE = '#1E0E0A'

type DataByDay = {
  time: number
  value: number
}

type LineChartProps = {
  data: DataByDay[]
  color?: string | undefined
  height?: number | undefined
  minHeight?: number
  value?: number
  setValue?: (value: number | undefined) => void
  label?: number
  setLabel?: (value: number | undefined) => void
  topLeft?: ReactNode | undefined
  topRight?: ReactNode | undefined
  bottomLeft?: ReactNode | undefined
  bottomRight?: ReactNode | undefined
  className?: string
} & Omit<HTMLAttributes<HTMLDivElement>, 'className'>

export default function LineChart({
  data,
  color = LIGHT_CRE,
  value,
  setValue,
  label,
  setLabel,
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
  minHeight = DEFAULT_HEIGHT,
  className = '',
  ...rest
}: LineChartProps) {
  const parsedValue = value

  return (
    <div
      {...rest}
      className={`${className} flex flex-col w-full bg-darkCRE p-4 rounded-xl`}
      style={{
        minWidth: '0',
        height: `${minHeight}px`,
        minHeight: `${minHeight}px`,
      }}
    >
      <div className="shrink-0 grow-0 flex justify-between">
        {topLeft ?? null}
        {topRight ?? null}
      </div>

      <div className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          {/* the below width & height are as default */}
          <AreaChart
            width={400}
            height={220}
            data={data}
            margin={{
              top: 4,
              right: 32,
              left: 24,
              bottom: 4,
            }}
            onMouseLeave={() => {
              setValue && setValue(undefined)
              setLabel && setLabel(undefined)
            }}
          >
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={darken(0.6, color)} stopOpacity={0.5} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tickFormatter={(time: DataByDay['time']) => dayjs(time).format('DD')}
              minTickGap={10}
            />
            <Tooltip
              cursor={{ stroke: LIGHT_CRE }}
              contentStyle={{ display: 'none' }}
              formatter={(
                value: DataByDay['value'],
                name: string,
                props: { payload: { time: DataByDay['time']; value: DataByDay['value'] } }
              ) => {
                if (setValue && parsedValue !== props.payload.value) {
                  setValue(props.payload.value)
                }

                if (setLabel && label !== props.payload.time) setLabel(props.payload.time)
              }}
            />
            <Area dataKey="value" type="monotone" stroke={color} fill="url(#gradient)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="shrink-0 grow-0 flex justify-between">
        {bottomLeft ?? null}
        {bottomRight ?? null}
      </div>
    </div>
  )
}
