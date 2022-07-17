import { GLOW_CRE, LIGHT_CRE } from 'constants/style'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { HTMLAttributes, ReactNode, useMemo } from 'react'
import { Bar, BarChart as Chart, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import type { ComposedChartEntry } from 'types/chart'

dayjs.extend(utc)

const DEFAULT_HEIGHT = 300

export type LineChartProps = {
  data: ComposedChartEntry[]
  dataKeys: string[]
  colors?: string[]
  height?: number | undefined
  minHeight?: number
  setIndex?: (value: number | undefined) => void
  setLabel?: (value: number | undefined) => void
  index?: number
  label?: number
  tickFormatter?: (tick: ComposedChartEntry['time']) => string
  topLeft?: ReactNode | undefined
  topRight?: ReactNode | undefined
  bottomLeft?: ReactNode | undefined
  bottomRight?: ReactNode | undefined
  className?: string
} & HTMLAttributes<HTMLDivElement>

export default function ComposedBarChart({
  data,
  dataKeys,
  colors = [GLOW_CRE],
  setIndex,
  setLabel,
  index,
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
  const chartColors = useMemo(() => colors.slice().reverse(), [colors])

  const chartData = useMemo(() => {
    return data.map((item) => {
      let accmVal = 0
      const accmData = dataKeys.reduce((accm: { [key: string]: number }, key) => {
        accmVal += item[key]
        accm[key] = accmVal
        return accm
      }, {})

      return {
        time: item.time,
        ...accmData,
      }
    })
  }, [data, dataKeys])

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
            barGap={'-79.3%'}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            onMouseLeave={() => {
              setLabel && setLabel(undefined)
              setIndex && setIndex(undefined)
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
              formatter={(value: number, name: string, props: { payload: { time: ComposedChartEntry['time'] } }) => {
                if (setLabel && label !== props.payload.time) {
                  setLabel(props.payload.time)
                }

                const currentIndex = data.findIndex((item) => item.time === props.payload.time)

                if (setIndex && index !== currentIndex) {
                  setIndex(currentIndex)
                }
              }}
            />
            {dataKeys
              .slice()
              .reverse()
              .map((key, i) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={chartColors[i] ?? chartColors.at(-1)}
                  shape={(props) => {
                    return (
                      <CustomBar
                        height={props.height}
                        width={props.width}
                        x={props.x}
                        y={props.y}
                        fill={chartColors[i] ?? chartColors.at(-1)}
                      />
                    )
                  }}
                />
              ))}
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
