import BigNumber from 'bignumber.js'
import Card from 'components/Card'
import Dot from 'components/Dot'
import H3 from 'components/H3'
import Indicator from 'components/Indicator'
import PieChart from 'components/PieChart'
import { CRE_CHART_COLOR_MAP } from 'constants/style'
import dayjs from 'dayjs'
import { transparentize } from 'polished'
import { useCallback, useMemo, useState } from 'react'
import { VolUSDByDate } from 'types/accounts'
import type { PieChartEntry } from 'types/chart'
import { formatUSDAmount } from 'utils/amount'

export default function VolumeByPairChart({ date, chartData }: { date: number; chartData: VolUSDByDate[] }) {
  const dateLabel = useMemo(() => dayjs(date).format('YYYY MMM DD'), [date])

  const totalVolUSD = useMemo(() => {
    return new BigNumber(chartData.find((item) => item.date === date)?.vol ?? 0)
  }, [chartData, date])

  const getRatioByPair = useCallback(
    (item: PieChartEntry) => {
      return (
        new BigNumber(item.value)
          .div(totalVolUSD)
          .multipliedBy(100)
          //   .decimalPlaces(1, BigNumber.ROUND_HALF_UP)
          .toFormat(0) + '%'
      )
    },
    [totalVolUSD]
  )

  const pairWideVolUSDList = useMemo<PieChartEntry[]>(
    () =>
      chartData
        .find((item) => item.date === date)
        ?.detail.map((item) => ({
          type: item.pair,
          value: item.usd_vol,
        })) ?? [],
    [chartData, date]
  )

  const colorMap = useMemo<{ [x: string]: string }>(
    () =>
      pairWideVolUSDList.reduce(
        (accm, item, index) => ({
          ...accm,
          [item.type]: CRE_CHART_COLOR_MAP?.[index] ?? CRE_CHART_COLOR_MAP?.at(-index),
        }),
        {}
      ),
    [pairWideVolUSDList]
  )

  const [volHover, setvolHover] = useState<number | undefined>()
  const [pairHover, setpairHover] = useState<string | undefined>()

  return (
    <div className="space-y-4">
      <H3 title={dateLabel} />
      <div className="flex flex-col md:flex-row items-stretch">
        <PieChart
          className="grow-0 shrink-0 basis-[100%] md:basis-[50%]"
          data={pairWideVolUSDList}
          colorMap={colorMap}
          value={volHover}
          setValue={setvolHover}
          label={pairHover}
          setLabel={setpairHover}
          cardMerged="right-bottom"
          topLeft={
            <Indicator title="Volume 24h by pair" light={true} label={pairHover ? `#${pairHover}` : 'Total'}>
              <div className="flex items-center space-x-3 TYPO-BODY-XL !font-black FONT-MONO">
                {formatUSDAmount({
                  value: volHover ? new BigNumber(volHover) : totalVolUSD,
                  mantissa: 0,
                })}
              </div>
            </Indicator>
          }
        />
        <Card useGlassEffect={true} className="min-w-[300px] md:basis-[50%]" merged="left-top">
          <Indicator light={true} className="md:pt-[2rem]">
            {pairWideVolUSDList
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
                    <span className="TYPO-BODY-XS md:TYPO-BODY-S">{getRatioByPair(item)}</span>
                  </div>
                </div>
              ))}
          </Indicator>
        </Card>
      </div>
    </div>
  )
}
