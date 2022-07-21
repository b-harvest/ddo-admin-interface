import Card from 'components/Card'
import { GLOW_CRE, LIGHT_CRE } from 'constants/style'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { darken } from 'polished'
import { HTMLAttributes, ReactNode, useCallback } from 'react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import { CategoricalChartState } from 'recharts/types/chart/generateCategoricalChart'
import type { GenericChartEntry } from 'types/chart'

dayjs.extend(utc)

const DEFAULT_HEIGHT = 300

type LineChartProps = {
  data: GenericChartEntry[]
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
  ...rest
}: LineChartProps) {
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
            onMouseEnter={handleMouseOn}
            onMouseMove={handleMouseOn}
            onMouseLeave={handleMouseLeave}
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
              tickFormatter={(time: GenericChartEntry['time']) => dayjs(time).format('MM')}
              minTickGap={10}
            />
            <Tooltip cursor={{ stroke: LIGHT_CRE }} contentStyle={{ display: 'none' }} />
            <Area dataKey="value" type="monotone" stroke={color} fill="url(#gradient)" strokeWidth={2} />
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
