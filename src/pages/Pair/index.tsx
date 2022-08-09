import BigNumber from 'bignumber.js'
import AppPage from 'components/AppPage'
import Card from 'components/Card'
import IconButton from 'components/IconButton'
import Indicator from 'components/Indicator'
import TableList from 'components/TableList'
import usePair from 'hooks/usePair'
import usePool from 'hooks/usePool'
import AssetLogoLabel from 'pages/components/AssetLogoLabel'
import PoolsTable from 'pages/components/PoolsTable'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { PairDetail } from 'types/pair'
import { formatUSDAmount } from 'utils/amount'

export default function Pair() {
  const { id }: { id: string } = useParams()
  const { findPairById } = usePair()
  const pairDetail = findPairById(Number(id))

  console.log(pairDetail)

  const pairLabel = useMemo(
    () =>
      pairDetail
        ? AssetLogoLabel({ assets: pairDetail.assetTickers, nowrap: true, isSingleAssetAutoSpaced: true })
        : null,
    [pairDetail]
  )

  // pair price
  const [isPriceForward, setIsPriceForward] = useState<boolean>(true)
  const onPriceForwardToggle = () => setIsPriceForward(!isPriceForward)

  const price = useMemo<BigNumber | undefined>(() => {
    if (!pairDetail) return undefined
    return isPriceForward
      ? pairDetail.lastPrice
      : new BigNumber(1).div(pairDetail.lastPrice).dp(6, BigNumber.ROUND_DOWN)
  }, [isPriceForward, pairDetail])

  const quoteTicker = useMemo<string | undefined>(
    () => (pairDetail ? (isPriceForward ? pairDetail.quoteAsset?.ticker : pairDetail.baseAsset?.ticker) : undefined),
    [isPriceForward, pairDetail]
  )

  const lastPriceUSD = useMemo<BigNumber | undefined>(() => {
    const priceOracle =
      (isPriceForward ? pairDetail?.quoteAsset?.live?.priceOracle : pairDetail?.baseAsset?.live?.priceOracle) ?? 0
    return pairDetail && price ? price.multipliedBy(priceOracle) : undefined
  }, [isPriceForward, pairDetail, price])

  // price table
  const { getAssetTickers } = usePool()
  const priceTableList = useMemo<PairDetail[]>(() => {
    return pairDetail
      ? [
          {
            ...pairDetail,
            base: pairDetail.baseAsset
              ? AssetLogoLabel({
                  assets: getAssetTickers(pairDetail.baseAsset),
                  nowrap: true,
                  isSingleAssetAutoSpaced: true,
                })
              : null,
            quote: pairDetail.quoteAsset
              ? AssetLogoLabel({
                  assets: getAssetTickers(pairDetail.quoteAsset),
                  nowrap: true,
                  isSingleAssetAutoSpaced: true,
                })
              : null,
            predDiff: pairDetail.predPrice.minus(pairDetail.lastPrice).div(pairDetail.predPrice).toNumber() * 100,
          },
        ]
      : []
  }, [pairDetail, getAssetTickers])

  return (
    <AppPage>
      {pairDetail ? (
        <>
          <header className="flex flex-col items-stretch space-y-3 mb-8">
            <div className="flex items-center justify-start space-x-2">
              <div>{pairLabel}</div>
              <div>#{pairDetail.pairId}</div>
            </div>

            <div className="flex items-end gap-x-2 FONT-MONO">
              <div className={`TYPO-BODY-2XL ${isPriceForward ? '' : ' text-pinkCRE'}`} title="Pair price">
                <span>{price ? price.toFormat() : '-'}</span>
                <span className="TYPO-BODY-S"> {quoteTicker}</span>
                <span className="TYPO-BODY-M" title="Pair price in USD">
                  {' '}
                  (≈{formatUSDAmount({ value: lastPriceUSD, mantissa: 2 })})
                </span>
              </div>
              <IconButton
                type="swap"
                className="-translate-y-1 text-grayCRE-400 hover:text-grayCRE-300 dark:text-grayCRE-200 dark:hover:text-grayCRE-300"
                onClick={onPriceForwardToggle}
              />
            </div>
          </header>

          <section className="flex flex-col md:flex-row items-stretch md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-20">
            <Card useGlassEffect={true} className="grow shrink basis-[30%]">
              <Indicator title="TVL" light={true} className="TYPO-BODY-L !font-bold">
                <div className="FONT-MONO">{formatUSDAmount({ value: pairDetail.tvlUSD, mantissa: 0 })}</div>
              </Indicator>
            </Card>
            <Card useGlassEffect={true} className="grow shrink basis-[30%]">
              <Indicator title="Trading Volume 24h" light={true} className="TYPO-BODY-L !font-bold">
                <div className="FONT-MONO">{formatUSDAmount({ value: pairDetail.vol24USD, mantissa: 0 })}</div>
              </Indicator>
            </Card>
            <Card useGlassEffect={true} className="grow shrink basis-[30%]">
              <Indicator title="Volume/TVL" light={true} className="TYPO-BODY-L !font-bold">
                <div className="FONT-MONO">{pairDetail.volTvlRatio.toFixed(2)}%</div>
              </Indicator>
            </Card>
          </section>

          <section className="space-y-20">
            <TableList<PairDetail>
              title="Price tracking"
              useNarrow={true}
              useSearch={false}
              list={priceTableList}
              fields={[
                // {
                //   label: 'Base',
                //   value: 'base',
                //   type: 'html',
                //   widthRatio: 8,
                //   responsive: true,
                // },
                {
                  label: 'Quote',
                  value: 'quote',
                  type: 'html',
                  widthRatio: 8,
                },
                {
                  label: 'Chage 24h',
                  value: 'change_24',
                  type: 'change',
                  widthRatio: 2,
                },
                {
                  label: 'High 24h',
                  value: 'high_24',
                  type: 'bignumber',
                  toFixedFallback: 6,
                },
                {
                  label: 'Low 24h',
                  value: 'low_24',
                  type: 'bignumber',
                  toFixedFallback: 6,
                },
                {
                  label: 'Last',
                  value: 'lastPrice',
                  type: 'bignumber',
                  toFixedFallback: 6,
                },
                {
                  label: 'Predicted',
                  value: 'predPrice',
                  type: 'bignumber',
                  toFixedFallback: 6,
                },
                {
                  label: 'Last → predicted',
                  value: 'predDiff',
                  type: 'change',
                },
              ]}
            />
            <PoolsTable byPair={pairDetail} title="Pools" />
          </section>
        </>
      ) : null}
    </AppPage>
  )
}
