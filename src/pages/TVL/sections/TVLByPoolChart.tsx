import BigNumber from 'bignumber.js'
import Card from 'components/Card'
import Dot from 'components/Dot'
import H3 from 'components/H3'
import Indicator from 'components/Indicator'
import PieChart from 'components/PieChart'
import usePieChart from 'components/PieChart/hooks'
import { DATE_FORMAT } from 'constants/time'
import dayjs from 'dayjs'
import { transparentize } from 'polished'
import { useMemo, useState } from 'react'
import type { TVLUSDByDate } from 'types/accounts'
import type { PieChartEntry } from 'types/chart'
import { formatUSDAmount } from 'utils/amount'

export default function TVLByPoolChart({ date, chartData }: { date: number; chartData: TVLUSDByDate[] }) {
  const { getRatioByType, getColorMap } = usePieChart()

  const dateLabel = useMemo(() => dayjs(date).format(DATE_FORMAT), [date])

  const totalTvlUSD = useMemo(() => {
    return new BigNumber(chartData.find((item) => item.date === date)?.tvl ?? 0)
  }, [chartData, date])

  const poolWideTvlUSDList = useMemo<PieChartEntry[]>(
    () =>
      chartData
        .find((item) => item.date === date)
        ?.detail.map((item) => ({
          type: item.pool,
          value: item.tvl,
        })) ?? [],
    [chartData, date]
  )

  const colorMap = getColorMap(poolWideTvlUSDList)

  const [tvlHover, setTvlHover] = useState<number | undefined>()
  const [poolHover, setPoolHover] = useState<string | undefined>()

  return (
    <div className="space-y-4">
      <H3 title={dateLabel} />
      <div className="flex flex-col md:flex-row items-stretch">
        <PieChart
          className="grow-0 shrink-0 basis-[100%] md:basis-[50%]"
          data={poolWideTvlUSDList}
          colorMap={colorMap}
          value={tvlHover}
          setValue={setTvlHover}
          label={poolHover}
          setLabel={setPoolHover}
          cardMerged="right-bottom"
          topLeft={
            <Indicator title="TVL by pool" light={true} label={poolHover ? `#${poolHover}` : 'Total'}>
              <div className="flex items-center space-x-3 TYPO-BODY-XL !font-black FONT-MONO">
                {formatUSDAmount({
                  value: tvlHover ? new BigNumber(tvlHover) : totalTvlUSD,
                  mantissa: 0,
                })}
              </div>
            </Indicator>
          }
        />
        <Card useGlassEffect={true} className="min-w-[300px] md:basis-[50%]" merged="left-top">
          <Indicator light={true} className="md:pt-[2rem]">
            {poolWideTvlUSDList
              .sort((a, b) => b.value - a.value)
              .map((item, i) => (
                <div key={item.type} className="w-full flex items-center space-x-4">
                  {colorMap && <Dot color={transparentize(0.4, colorMap[item.type])} />}
                  <div className="shrink grow w-full flex items-center space-x-4 TYPO-BODY-S md:TYPO-BODY-M text-neutral-800 dark:text-grayCRE-100">
                    <span className="basis-[14%]">#{item.type}</span>{' '}
                    <span className="FONT-MONO !font-bold">
                      {formatUSDAmount({
                        value: new BigNumber(item.value),
                        mantissa: 0,
                      })}
                    </span>
                    <span className="TYPO-BODY-XS md:TYPO-BODY-S">{getRatioByType(item, totalTvlUSD)}</span>
                  </div>
                </div>
              ))}
          </Indicator>
        </Card>
      </div>
    </div>
  )
}
