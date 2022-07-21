import { Column } from '@ant-design/charts'
import Card, { CardMergedSide } from 'components/Card'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { ReactNode, useMemo } from 'react'
import type { ComposedChartEntry } from 'types/chart'

dayjs.extend(utc)

const DEFAULT_HEIGHT = 300

const ACTIVE_EVENTS = ['mouseenter', 'mousemove', 'touchstart', 'touchmove']
const DEACTIVE_EVENTS = ['mouseout', 'mouseleave', 'touchend', 'touchcancel']

export type AntComposedBarChartProps = {
  data: ComposedChartEntry[]
  colorMap: { [x: string]: string }
  height?: number
  setLabel?: (value: number | undefined) => void
  label?: number
  topLeft?: ReactNode | undefined
  topRight?: ReactNode | undefined
  bottomLeft?: ReactNode | undefined
  bottomRight?: ReactNode | undefined
  className?: string
  cardMerged?: CardMergedSide
  legend?: boolean
}

export default function ComposedBarChart({
  data,
  colorMap,
  height = DEFAULT_HEIGHT,
  //   setIndex,
  setLabel,
  //   index,
  label,
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
  className = '',
  cardMerged,
  legend = false,
}: AntComposedBarChartProps) {
  const config = useMemo(
    () => ({
      data,
      autoFit: true,
      height: height ?? DEFAULT_HEIGHT,
      xField: 'time',
      yField: 'value',
      meta: {
        time: { alias: '' },
        value: { alias: '' },
      },
      isStack: true,
      seriesField: 'type',
      yAxis: { grid: { line: { style: { lineWidth: 0 } } }, label: { formatter: () => '' } },
      xAxis: {
        tickLine: { style: { lineWidth: 0 } },
        line: { style: { lineWidth: 0 } },
        label: { formatter: () => '' },
      },
      position: 'left',
      colorField: 'type',
      color: (item) => colorMap[item.type],
      dodgePadding: -1,
      columnStyle: {
        lineWidth: 0,
        strokeOpacity: 0,
        shadowColor: 'rgba(0,0,0,0)',
      },
      legend: {
        flipPage: false,
        position: 'bottom-right' as const,
        layout: 'horizontal' as const,
        marker: {
          symbol: 'circle' as const,
          style: { opacity: 0, width: 0, height: 0 },
        },
        itemName: { formatter: () => '' },
        itemWidth: 0,
        itemHeight: 0,
      },
      tooltip: {
        title: '',
        container: '',
        // formatter: (item) => {
        //   return { title: new BigNumber(item.time).toFormat(0), name: item.type, value: item.value }
        // },
      },
      lineOpacity: 0,
      intervalPadding: 0,
      onEvent: (_, event) => {
        if (ACTIVE_EVENTS.includes(event.type)) {
          const item = event.data?.data
          if (setLabel && item && label !== item.time) {
            setLabel(item.time)
          }
        } else if (DEACTIVE_EVENTS.includes(event.type)) {
          if (setLabel) setLabel(undefined)
        }
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [colorMap, height, data, setLabel] // shouldn't include label as dependency
  )

  return (
    <Card
      className={className}
      useGlassEffect={true}
      merged={cardMerged}
      style={{
        minWidth: '0',
        minHeight: `${height}px`,
      }}
    >
      <div className="shrink-0 grow-0 flex justify-between">
        {topLeft ?? null}
        {topRight ?? null}
      </div>

      <div className="w-full h-full text-left !FONT-MONO pr-2">
        <Column {...config} />
      </div>

      <div className="shrink-0 grow-0 flex justify-between">
        {bottomLeft ?? null}
        {bottomRight ?? null}
      </div>
    </Card>
  )
}
