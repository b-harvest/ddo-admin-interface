import BigNumber from 'bignumber.js'
import AppPage from 'components/AppPage'
import Card from 'components/Card'
import IconButton from 'components/IconButton'
import Indicator from 'components/Indicator'
import usePair from 'hooks/usePair'
import AssetLogoLabel from 'pages/components/AssetLogoLabel'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { formatUSDAmount } from 'utils/amount'

export default function Pair() {
  const { id }: { id: string } = useParams()
  const { findPairById } = usePair()
  const pairDetail = findPairById(Number(id))

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
              <div
                className={`TYPO-BODY-2XL ${isPriceForward ? '' : 'text-grayCRE-300 dark:text-grayCRE-400'}`}
                title="Pair price"
              >
                <span>{price ? price.toFormat() : '-'}</span>
                <span className="TYPO-BODY-S"> {quoteTicker}</span>
                <span className="TYPO-BODY-M" title="Pair price in USD">
                  {' '}
                  (≈ {formatUSDAmount({ value: lastPriceUSD, mantissa: 2 })})
                </span>
              </div>
              <IconButton
                type="swap"
                className="-translate-y-1 text-grayCRE-400 hover:text-grayCRE-300 dark:text-grayCRE-200 dark:hover:text-grayCRE-300"
                onClick={onPriceForwardToggle}
              />
            </div>
          </header>

          <section className="flex flex-col md:flex-row items-stretch md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-2">
            <Card useGlassEffect={true} className="grow shrink basis-[30%]">
              <Indicator title="Price high 24h" light={true} className="TYPO-BODY-L !font-bold">
                <div className={`flex items-end gap-x-2 FONT-MONO`}>{pairDetail.high_24}</div>
              </Indicator>
            </Card>

            <Card useGlassEffect={true} className="grow shrink basis-[30%]">
              <Indicator title="Price low 24h" light={true} className="TYPO-BODY-L !font-bold">
                <div className={`flex items-end gap-x-2 FONT-MONO`}>{pairDetail.low_24}</div>
              </Indicator>
            </Card>

            <Card useGlassEffect={true} className="grow shrink basis-[30%]">
              <Indicator title="Price change 24h" light={true} className="TYPO-BODY-L !font-bold">
                <div
                  className={`flex items-center gap-x-2 FONT-MONO ${
                    pairDetail.change_24 > 0 ? 'text-success' : pairDetail.change_24 < 0 ? 'text-error' : ''
                  }`}
                >
                  {pairDetail.change_24 > 0 ? '+' : pairDetail.change_24 < 0 ? '-' : null}
                  {Math.abs(pairDetail.change_24)}%
                </div>
              </Indicator>
            </Card>
          </section>
        </>
      ) : null}
    </AppPage>
  )
}
