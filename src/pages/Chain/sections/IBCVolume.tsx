import PieChart from 'components/PieChart'
// import AntPieChart from 'components/PieChart/ant'
import { CHART_COLOR_MAP } from 'constants/style'
import { useMemo, useState } from 'react'

const rawList = [
  //   { type: 'USDC.axl', value: 111 },
  { type: 'USDC.axl', value: 2422 },
  { type: 'WETH.axl', value: 414 },
  { type: 'WBTC.axl', value: 4211 },
  { type: 'Osmo', value: 203 },
]

export default function IBCVolume() {
  const chartData = rawList

  const colorMap = useMemo(() => {
    const map =
      rawList.length > 0
        ? [...new Set(rawList.map((item) => item.type))]
            .map((type, i) => ({ [type]: CHART_COLOR_MAP[i] ?? CHART_COLOR_MAP.at(-1) }))
            .reduce((accm, set) => ({ ...accm, ...set }), {})
        : undefined
    return map
  }, [])

  const [ibcVolumeHover, setIbcVolumeHover] = useState<number | undefined>()
  const [ibcAssetHover, setIbcAssetHover] = useState<string | undefined>()

  return (
    <>
      {colorMap && (
        <div>
          <PieChart
            data={chartData}
            colorMap={colorMap}
            value={ibcVolumeHover}
            setValue={setIbcVolumeHover}
            label={ibcAssetHover}
            setLabel={setIbcAssetHover}
            topRight={
              <div className="dark:text-white">
                {ibcAssetHover} {ibcVolumeHover}
              </div>
            }
          />
          {/* <AntPieChart data={chartData} colorMap={colorMap} /> */}
        </div>
      )}
    </>
  )
}
