import Card from 'components/Card'
import { GLOW_CRE, LIGHT_CRE, PINK_CRE, WHITE } from 'constants/style'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { darken } from 'polished'
import { HTMLAttributes, ReactNode, useCallback, useMemo } from 'react'
import { Area, AreaChart, ReferenceDot, ReferenceLine, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import { CategoricalChartState } from 'recharts/types/chart/generateCategoricalChart'
import type { GenericChartEntry } from 'types/chart'

dayjs.extend(utc)

const DEFAULT_HEIGHT = 300

type LineChartProps = {
  data: GenericChartEntry[]
  highlightTime?: GenericChartEntry['time']
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
  onClick?: (time: number | undefined) => void
} & Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'onClick'>

export default function LineChart({
  data,
  highlightTime,
  color = GLOW_CRE,
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
  onClick,
  ...rest
}: LineChartProps) {
  const highlightValue = useMemo<number | undefined>(
    () => data.find((item) => item.time === highlightTime)?.value,
    [data, highlightTime]
  )

  const handleMouseOn = useCallback(
    (props: CategoricalChartState) => {
      if (setValue && props.activePayload && value !== props.activePayload[0]?.payload?.value) {
        setValue(props.activePayload[0]?.payload?.value)
      }

      if (setLabel && props.isTooltipActive && label !== props.activeLabel) {
        setLabel((props.activeLabel as number | undefined) ?? 0)
      }
    },
    [setValue, value, setLabel, label]
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

      <div className={`w-full h-full`}>
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
            onMouseEnter={handleMouseOn}
            onMouseMove={handleMouseOn}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
          >
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={darken(0.6, color)} stopOpacity={0.5} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              id="x"
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tickFormatter={(time: GenericChartEntry['time']) => dayjs(time).format('DD')}
              minTickGap={10}
            />
            {highlightTime && highlightValue && (
              <>
                <ReferenceDot
                  x={highlightTime}
                  y={highlightValue}
                  isFront={true}
                  fill={PINK_CRE}
                  stroke={WHITE}
                  strokeWidth={2}
                  r={4}
                />
                <ReferenceLine x={highlightTime} isFront={true} stroke={PINK_CRE} />
              </>
            )}
            <Tooltip
              active={true}
              cursor={{ stroke: highlightTime !== undefined && highlightTime === label ? PINK_CRE : LIGHT_CRE }}
              contentStyle={{ display: 'none' }}
            />
            <Area
              dataKey="value"
              type="monotone"
              stroke={color}
              fill="url(#gradient)"
              strokeWidth={2}
              cursor={onClick ? 'pointer' : 'default'}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="shrink-0 grow-0 flex justify-between">
        {bottomLeft ?? null}
        {bottomRight ?? null}
      </div>
    </Card>
  )
}
