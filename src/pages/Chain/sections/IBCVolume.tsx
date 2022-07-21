import BigNumber from 'bignumber.js'
import Card from 'components/Card'
import Dot from 'components/Dot'
import Indicator from 'components/Indicator'
import PieChart from 'components/PieChart'
// import AntPieChart from 'components/PieChart/ant'
import { VIVID_CHART_COLOR_MAP } from 'constants/style'
import useAsset from 'hooks/useAsset'
import usePair from 'hooks/usePair'
import { transparentize } from 'polished'
import { useMemo, useState } from 'react'
import { formatUSDAmount } from 'utils/amount'

export default function IBCVolume() {
  const { allAsset } = useAsset()
  const { getVol24USDbyDenom } = usePair()

  const chartData = useMemo(() => {
    return allAsset
      .filter((asset) => asset.denom.includes('ibc'))
      .map((asset) => ({
        type: asset.ticker ?? asset.denom,
        value: getVol24USDbyDenom(asset.denom).toNumber(),
      }))
  }, [allAsset, getVol24USDbyDenom])

  const colorMap = useMemo(() => {
    const map =
      chartData.length > 0
        ? [...new Set(chartData.map((item) => item.type))]
            .map((type, i) => ({ [type]: VIVID_CHART_COLOR_MAP[i] ?? VIVID_CHART_COLOR_MAP.at(-1) }))
            .reduce((accm, set) => ({ ...accm, ...set }), {})
        : undefined
    return map
  }, [chartData])

  const [ibcVolumeHover, setIbcVolumeHover] = useState<number | undefined>()
  const [ibcAssetHover, setIbcAssetHover] = useState<string | undefined>()

  const totalIbcVolume = useMemo(() => {
    return chartData.reduce((accm, item) => accm.plus(new BigNumber(item.value)), new BigNumber(0))
  }, [chartData])

  return (
    <section>
      <header className="flex flex-col justify-start align-stretch space-y-6 mb-4">
        <h3 className="flex justify-start items-center TYPO-H3 text-black dark:text-white text-left">IBC Volume 24h</h3>
      </header>

      {colorMap && (
        <div className="flex flex-col md:flex-row items-stretch">
          <PieChart
            className="grow-0 shrink-0 basis-[100%] md:basis-[30%]"
            data={chartData}
            colorMap={colorMap}
            value={ibcVolumeHover}
            setValue={setIbcVolumeHover}
            label={ibcAssetHover}
            setLabel={setIbcAssetHover}
            cardMerged="right-bottom"
            topLeft={
              <Indicator title="IBC Volume 24h" light={true} label={ibcAssetHover ?? 'Total'}>
                <div className="flex TYPO-BODY-XL !font-bold">
                  <div className="flex items-center space-x-3">
                    {formatUSDAmount({
                      value: ibcVolumeHover ? new BigNumber(ibcVolumeHover) : totalIbcVolume,
                      mantissa: 0,
                    })}
                  </div>
                </div>
              </Indicator>
            }
          />
          <Card useGlassEffect={true} className="min-w-[300px] md:basis-[70%]" merged="left-top">
            <Indicator light={true} className="md:pt-[2rem]">
              {chartData
                .sort((a, b) => b.value - a.value)
                .map((item, i) => (
                  <div key={item.type} className="flex items-center space-x-4">
                    {colorMap && <Dot color={transparentize(0.4, colorMap[item.type])} />}
                    <div className="flex items-center space-x-4 TYPO-BODY-XS md:TYPO-BODY-S text-neutral-800 dark:text-grayCRE-100">
                      <span>{item.type}</span>{' '}
                      <span className="FONT-MONO !font-bold">
                        {formatUSDAmount({
                          value: new BigNumber(item.value),
                          mantissa: 0,
                        })}
                      </span>
                    </div>
                  </div>
                ))}
            </Indicator>
          </Card>
        </div>
      )}
    </section>
  )
}
