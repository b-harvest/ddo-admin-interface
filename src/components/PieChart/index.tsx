import BigNumber from 'bignumber.js'
import Card from 'components/Card'
import { GLOW_CRE } from 'constants/style'
import { lighten } from 'polished'
import { ReactNode, useCallback, useState } from 'react'
import { Cell, Pie, PieChart as Chart, ResponsiveContainer, Sector } from 'recharts'
import { CategoricalChartState } from 'recharts/types/chart/generateCategoricalChart'
import type { PieChartEntry } from 'types/chart'

const DEFAULT_HEIGHT = 300

type PieChartProps = {
  data: PieChartEntry[]
  colorMap: { [x: string]: string }
  value?: number
  setValue?: (value: number | undefined) => void
  label?: string
  setLabel?: (value: string | undefined) => void
  topLeft?: ReactNode | undefined
  topRight?: ReactNode | undefined
  className?: string
}

export default function PieChart({
  data,
  colorMap,
  value,
  setValue,
  label,
  setLabel,
  topLeft,
  topRight,
  className,
}: PieChartProps) {
  const color = GLOW_CRE

  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined)

  const handleMouseOn = useCallback(
    (props: CategoricalChartState | null, event) => {
      if (props) {
        if (event.type === 'mouseenter' && props.activeTooltipIndex) {
          setActiveIndex(props.activeTooltipIndex)
        }

        if (setValue && props.activePayload && value !== props.activePayload[0]?.payload?.value) {
          setValue(props.activePayload[0]?.payload?.value)
        }
        if (setLabel && props.activePayload && label !== props.activePayload[0]?.payload?.type) {
          setLabel(props.activePayload[0]?.payload?.type)
        }
      }
    },
    [setValue, value, setLabel, label]
  )

  const handleMouseLeave = useCallback(() => {
    setActiveIndex(undefined)
    setLabel && setLabel(undefined)
    setValue && setValue(undefined)
  }, [setLabel, setValue])

  return (
    <Card
      className={className}
      style={{ width: `${DEFAULT_HEIGHT}px`, height: `${DEFAULT_HEIGHT}px`, minHeight: `${DEFAULT_HEIGHT}px` }}
    >
      <div className="shrink-0 grow-0 flex justify-between">
        {topLeft ?? null}
        {topRight ?? null}
      </div>

      <div className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <Chart
            width={730}
            height={250}
            onMouseEnter={handleMouseOn}
            onMouseMove={handleMouseOn}
            onMouseLeave={handleMouseLeave}
          >
            {/* <Tooltip cursor={{ stroke: LIGHT_CRE }} contentStyle={{ display: 'none' }} /> */}

            {/* <Tooltip cursor={{ fill: LIGHT_CRE }} contentStyle={{ display: 'none' }} /> */}

            {/* <Legend
        verticalAlign="middle"
        layout="vertical"
        height={36}
        chartHeight={12}
        iconSize={6}
        iconType="circle"
        wrapperStyle={{
          position: 'static',
          right: 0,
        }}
      /> */}

            {data.map((item) => (
              <defs key={item.type}>
                <linearGradient id={`gradient-${item.type}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={lighten(0.3, colorMap[item.type])} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
            ))}
            <Pie
              data={data}
              dataKey="value"
              nameKey="type"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              fill={GLOW_CRE}
              stroke={GLOW_CRE}
              label={(label) => `${label.name} ${new BigNumber(label.value).toFormat(0)}`}
              paddingAngle={5}
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
            >
              {data.map((item) => (
                <Cell key={item.type} fill={`url(#gradient-${item.type})`} />
              ))}
            </Pie>
          </Chart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

function renderActiveShape(props) {
  const RADIAN = Math.PI / 180
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props
  const sin = Math.sin(-RADIAN * midAngle)
  const cos = Math.cos(-RADIAN * midAngle)
  const sx = cx + (outerRadius + 10) * cos
  const sy = cy + (outerRadius + 10) * sin
  const mx = cx + (outerRadius + 30) * cos
  const my = cy + (outerRadius + 30) * sin
  const ex = mx + (cos >= 0 ? 1 : -1) * 22
  const ey = my
  const textAnchor = cos >= 0 ? 'start' : 'end'

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`PV ${value}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`${(percent * 100).toFixed(2)}%`}
      </text>
    </g>
  )
}
