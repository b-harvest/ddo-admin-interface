import Card, { CardMergedSide } from 'components/Card'
import { GLOW_CRE } from 'constants/style'
import { ReactNode, useCallback, useState } from 'react'
import { Cell, Pie, PieChart as Chart, ResponsiveContainer, Sector } from 'recharts'
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
  cardMerged?: CardMergedSide
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
  cardMerged,
}: PieChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined)

  const handleMouseOn = useCallback(
    (props, index) => {
      if (props) {
        if (typeof index === 'number') {
          setActiveIndex(props.activeTooltipIndex)
        }

        if (setValue && value !== props.payload?.value) {
          setValue(props.payload?.value)
        }

        // const percent = props.percent

        const newLabel = props.payload?.type
        if (setLabel && label !== newLabel) {
          setLabel(newLabel)
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
    <Card useGlassEffect={true} className={`${className} items-center`} merged={cardMerged}>
      <div className="shrink-0 grow-0 flex justify-between w-full">
        {topLeft ?? null}
        {topRight ?? null}
      </div>

      <div style={{ width: `${DEFAULT_HEIGHT}px`, height: `${DEFAULT_HEIGHT}px`, minHeight: `${DEFAULT_HEIGHT}px` }}>
        <div className="w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <Chart width={730} height={250}>
              {data.map((item) => {
                return (
                  <defs key={item.type}>
                    <linearGradient id={`gradient-${item.type}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colorMap?.[item.type] ?? GLOW_CRE} stopOpacity={1} />
                      <stop offset="100%" stopColor={colorMap?.[item.type] ?? GLOW_CRE} stopOpacity={0.5} />
                    </linearGradient>
                  </defs>
                )
              })}
              <Pie
                data={data}
                dataKey="value"
                nameKey="type"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                startAngle={90}
                endAngle={450}
                fill={GLOW_CRE}
                stroke={GLOW_CRE}
                // label={({ cx, cy, midAngle, innerRadius, outerRadius, index }) => {
                //   const RADIAN = Math.PI / 180
                //   // eslint-disable-next-line
                //   const radius = 25 + innerRadius + (outerRadius - innerRadius);
                //   // eslint-disable-next-line
                //   const x = cx + radius * Math.cos(-midAngle * RADIAN);
                //   // eslint-disable-next-line
                //   const y = cy + radius * Math.sin(-midAngle * RADIAN);

                //   return (
                //     <text
                //       x={x}
                //       y={y}
                //       fill={'#ffffff'}
                //       fontSize="0.5rem"
                //       textAnchor={x > cx ? 'start' : 'end'}
                //       dominantBaseline="central"
                //     >
                //       {data[index].type}
                //     </text>
                //   )
                // }}
                paddingAngle={5}
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                onMouseEnter={handleMouseOn}
                onMouseMove={handleMouseOn}
                onMouseLeave={handleMouseLeave}
              >
                {data.map((item) => (
                  <Cell key={item.type} fill={`url(#gradient-${item.type})`} />
                ))}
              </Pie>
            </Chart>
          </ResponsiveContainer>
        </div>
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
