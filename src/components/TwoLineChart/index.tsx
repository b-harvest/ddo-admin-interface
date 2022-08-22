import Card from 'components/Card'
import LoadingRows from 'components/LoadingRows'
import { GLOW_CRE, LIGHT_CRE, WHITE } from 'constants/style'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { lighten, transparentize } from 'polished'
import { HTMLAttributes, ReactNode, useCallback } from 'react'
import { Area, AreaChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import { CategoricalChartState } from 'recharts/types/chart/generateCategoricalChart'
import type { GenericTwoChartEntry } from 'types/chart'

dayjs.extend(utc)

const DEFAULT_HEIGHT = 300

type LineChartProps = {
  isLoading?: boolean
  data: GenericTwoChartEntry[]
  highlightTime?: GenericTwoChartEntry['time']
  highlightColor?: string
  color1?: string
  color2?: string
  time1?: number
  time2?: number
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

export default function TwoLineChart({
  isLoading = false,
  data,
  highlightTime,
  highlightColor = '#DDD',
  color1 = GLOW_CRE,
  color2 = WHITE,
  time1,
  time2,
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
  // const highlightValue = useMemo<number | undefined>(
  //   () => data.find((item) => item.time === highlightTime)?.value1,
  //   [data, highlightTime]
  // )

  const handleMouseOn = useCallback(
    (props: CategoricalChartState) => {
      // console.log(props)
      const newValue = props.activePayload
        ? props.activePayload[0]?.payload?.value1 ?? props.activePayload[0]?.payload?.value2
        : undefined
      if (setValue && props.activePayload && value !== newValue) {
        setValue(newValue)
      }

      if (setLabel && props?.isTooltipActive && label !== props?.activeLabel) {
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
      {isLoading ? (
        <LoadingRows rowsCnt={12} />
      ) : (
        <>
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
                  <linearGradient id="gradient1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={lighten(0.6, color1)} stopOpacity={0.5} />
                    <stop offset="100%" stopColor={color1} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradient2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={lighten(0.6, color2)} stopOpacity={0.5} />
                    <stop offset="100%" stopColor={color2} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  id="x"
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(time: GenericTwoChartEntry['time']) => {
                    if (highlightTime && highlightTime === time) {
                      return time.toString()
                    }
                    // else if (data.at(0)?.time === time || data.at(-1)?.time === time) {
                    //   return time.toString()
                    // }
                    // else if (time1 && time2) {
                    //   const allTimes = data.map((item) => item.time)
                    //   const time1Closest = getClosestTime(allTimes, time1)
                    //   const time2Closest = getClosestTime(allTimes, time2)
                    //   return [time1Closest, time2Closest].includes(time) ? time.toString() : ''
                    // }
                    else return ''
                  }}
                  minTickGap={10}
                />
                {highlightTime && <ReferenceLine x={highlightTime} isFront={true} stroke={highlightColor} />}
                {/* <ReferenceDot
                      x={highlightTime}
                      y={highlightValue}
                      isFront={true}
                      fill={highlightColor}
                      stroke={WHITE}
                      strokeWidth={2}
                      r={4}
                    /> */}

                <Tooltip
                  active={true}
                  cursor={{
                    stroke: highlightTime !== undefined && highlightTime === label ? highlightColor : LIGHT_CRE,
                  }}
                  contentStyle={{ display: 'none' }}
                />
                <Area
                  dataKey="value1"
                  type="monotone"
                  stroke={color1}
                  fill={transparentize(0.9, color1)}
                  strokeWidth={1}
                  cursor={onClick ? 'pointer' : 'default'}
                />
                <Area
                  dataKey="value2"
                  type="monotone"
                  stroke={color2}
                  fill={transparentize(0.9, color2)}
                  strokeWidth={1}
                  cursor={onClick ? 'pointer' : 'default'}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="shrink-0 grow-0 flex justify-between">
            {bottomLeft ?? null}
            {bottomRight ?? null}
          </div>
        </>
      )}
    </Card>
  )
}

// function getClosestTime(allTimes: number[], goalTime: number): number {
//   return allTimes.reduce(function (prev, curr) {
//     return Math.abs(curr - goalTime) < Math.abs(prev - goalTime) ? curr : prev
//   })
// }
