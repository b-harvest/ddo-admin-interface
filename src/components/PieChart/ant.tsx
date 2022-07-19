import { Pie } from '@ant-design/charts'
import BigNumber from 'bignumber.js'
import type { PieChartEntry } from 'types/chart'

export type AntPieChartProps = {
  data: PieChartEntry[]
  colorMap: { [x: string]: string }
  className?: string
}

export default function PieChart({ data, colorMap, className = '' }: AntPieChartProps) {
  const config = {
    //   data,
    //   meta: {
    //     country: {
    //       alias: '国家',
    //       range: [0, 1],
    //     },
    //     value: {
    //       alias: '数量',
    //       formatter: (v) => {
    //         return `${v}个`
    //       },
    //     },
    //   },
    //   angleField: 'value',
    //   colorField: 'country',
    renderer: 'svg' as const,
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'type',
    color: (item) => colorMap[item.type],
    pieStyle: {
      lineWidth: 1,
      // fillOpacity: 0.5,
    },
    radius: 1,
    innerRadius: 0.7,
    // 设置圆弧起始角度
    startAngle: Math.PI,
    endAngle: Math.PI * 4,
    label: {
      type: 'spiders',
      offset: '-8%',
      content: '{name}',
      style: { fontSize: 0 },
    },
    tooltip: {
      // formatter: (item) => {
      //   return { name: item.type, value: new BigNumber(item.value).toFormat(0) }
      // },
      container: ``,
      customContent: (type, items) => {
        const total = items.reduce((accm, item) => accm.plus(new BigNumber(item.value)), new BigNumber(0))
        return `<div>${type} ${total.toFormat(0)}</div>`
      },
    },
    //   interactions: [{ type: 'element-active' }],
  }

  //   const [pieChartConfig, setPieChartConfig] = useState<any>()

  //   useEffect(() => {
  //     setPieChartConfig(config)
  //   }, [])

  return <Pie {...config} />
}
