import AppPage from 'components/AppPage'
import Card from 'components/Card'
import CopyHelper from 'components/CopyHelper'
import ExplorerLink from 'components/ExplorerLink'
import Indicator from 'components/Indicator'
import TimestampMemo from 'components/TimestampMemo'
import useAsset from 'hooks/useAsset'
import usePair from 'hooks/usePair'
import usePool from 'hooks/usePool'
import AssetLogoLabel from 'pages/components/AssetLogoLabel'
import PairsTable from 'pages/components/PairsTable'
import PoolsTable from 'pages/components/PoolsTable'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import type { AssetDetail } from 'types/asset'
import { formatUSDAmount } from 'utils/amount'
import { abbrOver } from 'utils/text'

export default function Token() {
  const { id }: { id: string } = useParams()
  const denom = useMemo<string>(() => id.split('-').join('/'), [id])

  const { findAssetByDenom } = useAsset()
  const { getTVLUSDbyDenom, getVol24USDbyDenom } = usePair()
  const { findPoolByDenom, getAssetTickers } = usePool()

  const asset = findAssetByDenom(denom)

  const assetDetail = useMemo<AssetDetail | undefined>(() => {
    if (!asset) return undefined

    const vol24USD = getVol24USDbyDenom(asset.denom)
    const tvlUSD = getTVLUSDbyDenom(asset.denom)
    const priceOracle = asset.isPoolToken ? findPoolByDenom(asset.denom)?.priceOracle : asset.live?.priceOracle

    return {
      ...asset,
      priceOracle,
      vol24USD,
      tvlUSD,
    }
  }, [asset, findPoolByDenom, getTVLUSDbyDenom, getVol24USDbyDenom])

  const assetLabel = useMemo(
    () =>
      asset
        ? AssetLogoLabel({
            assets: getAssetTickers(asset),
            textSize: 'lg',
            isSingleAssetAutoSpaced: true,
            nowrap: true,
          })
        : null,
    [asset, getAssetTickers]
  )

  return (
    <AppPage>
      {assetDetail ? (
        <>
          <section className="flex flex-col items-stretch space-y-3 mb-8">
            <div className="flex items-center justify-start space-x-2">
              <div>{assetLabel}</div>
              <div>
                <CopyHelper toCopy={assetDetail.denom} iconPosition="left">
                  ({abbrOver(assetDetail.denom, 10)})
                </CopyHelper>
              </div>
            </div>
            <div className="TYPO-BODY-2XL FONT-MONO" title="Price oracle">
              {formatUSDAmount({ value: assetDetail.priceOracle })}
            </div>
          </section>

          <section className="flex flex-col md:flex-row items-stretch md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-2">
            <Card useGlassEffect={true} className="grow shrink">
              <Indicator
                title={assetDetail.isPoolToken ? 'Farm staked TVL (WIP)' : 'TVL'}
                light={true}
                className="TYPO-BODY-L !font-bold"
              >
                <div className="FONT-MONO">{formatUSDAmount({ value: assetDetail.tvlUSD, mantissa: 0 })}</div>
              </Indicator>
            </Card>
            <Card useGlassEffect={true} className="grow shrink">
              <Indicator title="Trading Volume 24h" light={true} className="TYPO-BODY-L !font-bold">
                <div className="FONT-MONO">{formatUSDAmount({ value: assetDetail.vol24USD, mantissa: 0 })}</div>
              </Indicator>
            </Card>
          </section>

          <section className="flex flex-col md:flex-row items-end md:items-center justify-between space-x-2 mb-10">
            {assetDetail.isPoolToken ? (
              <div></div>
            ) : (
              <TimestampMemo label="Price last synced" timestamp={assetDetail?.live?.updateTimestamp} />
            )}
            <ExplorerLink denom={denom} />
          </section>

          <section className="space-y-20">
            <PairsTable byAsset={assetDetail} title={assetDetail.isPoolToken ? 'Pair' : 'Pairs'} />
            <PoolsTable byAsset={assetDetail} title={assetDetail.isPoolToken ? 'Pool' : 'Pools'} />
          </section>
        </>
      ) : null}
    </AppPage>
  )
}
