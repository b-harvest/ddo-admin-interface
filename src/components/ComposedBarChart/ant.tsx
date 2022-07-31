import './ant.css'

import { Column } from '@ant-design/charts'
import Card, { CardMergedSide } from 'components/Card'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { ReactNode, useMemo } from 'react'
import type { ComposedChartEntry } from 'types/chart'

dayjs.extend(utc)

const DEFAULT_HEIGHT = 300

const ACTIVE_EVENTS = [
  // 'plot:mouseenter',
  // 'plot:mousemove',
  // 'plot:touchstart',
  // 'plot:touchmove',
  // 'tooltip:show',
  'tooltip:change',
]

const DEACTIVE_EVENTS = [
  'mouseout',
  // 'mouseleave',
  'touchend',
  'touchcancel',
  // 'tooltip:hide',
]

const CLICK_EVENTS = ['click']

export type AntComposedBarChartProps = {
  data: ComposedChartEntry[]
  colorMap: { [x: string]: string }
  height?: number
  setLabel?: (value: number | undefined) => void
  label?: number
  setItems?: (items: ComposedChartEntry[] | undefined) => void
  topLeft?: ReactNode | undefined
  topRight?: ReactNode | undefined
  bottomLeft?: ReactNode | undefined
  bottomRight?: ReactNode | undefined
  className?: string
  cardMerged?: CardMergedSide
  legend?: boolean
  onClick?: (item: ComposedChartEntry | undefined) => void
}

export default function ComposedBarChart({
  data,
  colorMap,
  height = DEFAULT_HEIGHT,
  //   setIndex,
  setLabel,
  setItems,
  //   index,
  label,
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
  className = '',
  cardMerged,
  legend = false,
  onClick,
}: AntComposedBarChartProps) {
  const config = useMemo(
    () => ({
      data,
      animation: false,
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
        container: undefined,
        formatter: () => {
          return { name: '', value: '' }
        },
      },
      lineOpacity: 0,
      intervalPadding: 0,
      onEvent: (_, event) => {
        if (ACTIVE_EVENTS.includes(event.type)) {
          const time = event.data?.title ? Number(event.data?.title) : undefined
          const items: ComposedChartEntry[] | undefined = event.data?.items?.map((item) => item.data) ?? undefined

          if (setLabel && time && label !== time) setLabel(time)
          if (setItems && items) setItems(items)
        } else if (DEACTIVE_EVENTS.includes(event.type)) {
          if (setLabel) setLabel(undefined)
          if (setItems) setItems(undefined)
        }

        if (CLICK_EVENTS.includes(event.type)) {
          const time: ComposedChartEntry | undefined = event.data?.data ?? label
          if (onClick) onClick(time)
        }
      },
    }),
    [colorMap, height, data, setLabel, label, setItems, onClick]
  )

  return (
    <Card
      className={className}
      useGlassEffect={true}
      merged={cardMerged}
      style={{
        minWidth: '0',
        minHeight: `${height}px`,
        // maxHeight: `${height}px`,
      }}
    >
      <div className="shrink-0 grow-0 flex justify-between">
        {topLeft ?? null}
        {topRight ?? null}
      </div>

      <div className="w-full h-full text-left !FONT-MONO pt-10 pl-3 pr-4">
        <Column {...config} />
      </div>

      <div className="shrink-0 grow-0 flex justify-between">
        {bottomLeft ?? null}
        {bottomRight ?? null}
      </div>
    </Card>
  )
}
