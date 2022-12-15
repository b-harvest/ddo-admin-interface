import BigNumber from 'bignumber.js'
import EmptyData from 'components/EmptyData'
import FoldableSection from 'components/FordableSection'
import TableList, { bignumberToFormat } from 'components/TableList'
import type { ListFieldBignumber } from 'components/TableList/types'
import Tag from 'components/Tag'
import TimestampMemo from 'components/TimestampMemo'
import AccountDataRewardsLCDFetcher from 'data/AccountDataRewardsLCDFetcher'
import useAsset from 'hooks/useAsset'
import usePool from 'hooks/usePool'
import AccountDataAlertArea from 'pages/Account/components/AccountDataAlertArea'
import AssetLogoLabel from 'pages/components/AssetLogoLabel'
import { useMemo, useState } from 'react'
import type { LpFarmRewardsLCDRaw, TokenAmountSet } from 'types/account'
import { AlertStatus } from 'types/alert'
import { getTokenWideFarmRewards } from 'utils/rewards'
import { isTimeDiffFromNowMoreThan } from 'utils/time'

type TokenWideFarmRewards = {
  [key: string]: (TokenAmountSet & {
    poolDenom: string
  })[]
}

export default function ClaimableRewards({
  significantTimeGap,
  backendTimestamp,
  backendData,
  onchainData,
  isLoading = true,
  address,
}: {
  significantTimeGap: number
  backendTimestamp: number
  backendData: TokenWideFarmRewards
  onchainData: TokenAmountSet[]
  isLoading: boolean
  address: string
}) {
  const { findAssetByDenom } = useAsset()
  const { findPoolByDenom, getAssetTickers } = usePool()

  /** @summary onchain data fetching by poolDenom */
  const [onchainDataWithRewards, setOnchainDataWithRewards] = useState<
    (TokenAmountSet & {
      poolDenom: string
    })[]
  >([])

  const onchainDataForDisplay = useMemo<TokenWideFarmRewards>(
    () => getTokenWideFarmRewards(onchainDataWithRewards),
    [onchainDataWithRewards]
  )

  const onFetched = (data: LpFarmRewardsLCDRaw, poolDenom) => {
    const oldData = onchainDataWithRewards.filter((reward) => reward.poolDenom !== poolDenom)

    const newData = data?.rewards.map((reward) => {
      const assetInfo = findAssetByDenom(reward.denom)
      return {
        denom: reward.denom,
        amount: new BigNumber(reward.amount).shiftedBy(-(assetInfo?.exponent ?? 0)),
        poolDenom,
      }
    })

    const mergedData = [...oldData, ...newData].sort((a, b) => a.poolDenom.localeCompare(b.poolDenom))
    setOnchainDataWithRewards(mergedData)
  }

  /** @summary table data */
  const rewardsListByToken = useMemo<any[][]>(() => {
    return Object.keys(onchainDataForDisplay).map((denom) => {
      const onchainList = onchainDataForDisplay[denom]
      const backendList = backendData[denom] ?? []

      const onchainTotal = onchainList.reduce((accm, item) => accm.plus(item.amount), new BigNumber(0))
      const backendTotal = backendList.reduce((accm, item) => accm.plus(item.amount), new BigNumber(0))

      return onchainList.map((item) => {
        const onchainRewardsAmount = item.amount
        const backendRewardsAmount = backendList.find((pool) => pool.poolDenom === item.poolDenom)?.amount

        // const priceOracle = findAssetByDenom(denom)?.live?.priceOracle
        // const onchainRewardsAmountUSD = onchainRewardsAmount.multipliedBy(priceOracle ?? 0)

        const poolAsset = findAssetByDenom(item.poolDenom)
        const poolLabel = poolAsset
          ? AssetLogoLabel({ assets: getAssetTickers(poolAsset), poolDenom: item.poolDenom })
          : undefined
        const poolId = findPoolByDenom(item.poolDenom)?.poolId

        const rewardsAsset = findAssetByDenom(item.denom)
        const rewardsAssetLabel = rewardsAsset
          ? AssetLogoLabel({
              assets: getAssetTickers(rewardsAsset),
              isSingleAssetAutoSpaced: true,
              nowrap: true,
            })
          : undefined
        const rewardsAssetLogo = rewardsAsset
          ? AssetLogoLabel({
              assets: getAssetTickers(rewardsAsset),
              hideTicker: true,
            })
          : undefined

        const totalDesc = TableTotalDesc({ amount: backendTotal, tag: 'Back-end' })
        const totalStatus: AlertStatus | undefined = onchainTotal
          .dp(rewardsAsset?.exponent ?? 6, BigNumber.ROUND_DOWN)
          .eq(backendTotal.dp(rewardsAsset?.exponent ?? 6, BigNumber.ROUND_DOWN))
          ? undefined
          : 'error'

        return {
          onchainRewardsAmount,
          backendRewardsAmount,
          // onchainRewardsAmountUSD,
          poolLabel,
          poolId,
          rewardsAssetLabel,
          rewardsAssetLogo,
          totalDesc,
          totalStatus,
        }
      })
    })
  }, [onchainDataForDisplay, backendData, findAssetByDenom, getAssetTickers, findPoolByDenom])

  const hasDiff = useMemo<boolean>(
    () => rewardsListByToken.findIndex((listByToken) => listByToken[0] && listByToken[0].totalStatus === 'error') > -1,
    [rewardsListByToken]
  )

  // alert-inline data - balance
  const isDelayed = useMemo<boolean>(
    () => isTimeDiffFromNowMoreThan(backendTimestamp, significantTimeGap),
    [backendTimestamp, significantTimeGap]
  )

  const allMatched = useMemo<boolean>(() => !hasDiff && !isDelayed, [hasDiff, isDelayed])

  return (
    <FoldableSection label="Claimable Rewards" defaultIsOpen={true}>
      {/* dummy Node to fetch via swr depending on onchainData; https://swr.vercel.app/docs/pagination#infinite-loading */}
      {onchainData.map((position) => (
        <AccountDataRewardsLCDFetcher
          key={position.denom}
          address={address}
          poolDenom={position.denom}
          interval={5000}
          onFetched={onFetched}
        />
      ))}

      {isLoading ? (
        <EmptyData isLoading={true} />
      ) : (
        <>
          <AccountDataAlertArea
            isActive={rewardsListByToken.length > 0}
            significantTimeGap={significantTimeGap}
            isDataTimeDiff={isDelayed}
            isDataNotMatched={hasDiff}
            isAllDataMatched={allMatched}
          />

          <div className="mt-4">
            <TimestampMemo label="Back-end last synced" timestamp={backendTimestamp} />
          </div>

          <div className="mt-8 space-y-10">
            {rewardsListByToken.length > 0 ? (
              rewardsListByToken.map((listByToken, i) =>
                listByToken.length ? (
                  <div key={i}>
                    <h4 className="flex justify-start items-center space-x-2 TYPO-H4 text-black dark:text-white mb-4">
                      <span>{listByToken[0].rewardsAssetLabel}</span>
                    </h4>

                    <TableList
                      title="Claimabale Rewards"
                      showTitle={false}
                      useSearch={false}
                      showFieldsBar={true}
                      list={listByToken}
                      mergedFields={[['onchainRewardsAmount', 'backendRewardsAmount']]}
                      mergedFieldLabels={['Rewards amount']}
                      defaultSortBy="rewardsAmount"
                      defaultIsSortASC={false}
                      totalField="onchainRewardsAmount"
                      totalLabel="Total rewards"
                      totalLabelSuffix={listByToken[0].rewardsAssetLogo}
                      totalDesc={listByToken[0].totalDesc}
                      totalStatus={listByToken[0].totalStatus}
                      nowrap={false}
                      fields={[
                        {
                          label: 'Pool',
                          value: 'poolLabel',
                          type: 'html',
                          widthRatio: 18,
                        },
                        {
                          label: 'Pool #',
                          value: 'poolId',
                          widthRatio: 12,
                          responsive: true,
                        },
                        {
                          label: 'On-chain rewards amount',
                          value: 'onchainRewardsAmount',
                          tag: 'On-chain',
                          type: 'bignumber',
                          toFixedFallback: 6,
                        },
                        {
                          label: 'Rewards amount',
                          value: 'backendRewardsAmount',
                          tag: 'Back-end',
                          type: 'bignumber',
                          toFixedFallback: 6,
                        },
                      ]}
                    />
                  </div>
                ) : null
              )
            ) : (
              <EmptyData label="No data" />
            )}
          </div>
        </>
      )}
    </FoldableSection>
  )
}

function TableTotalDesc({ amount, tag, prefix }: { amount: BigNumber; tag?: string; prefix?: JSX.Element }) {
  return (
    <div className="flex space-x-2 !font-black FONT-MONO">
      {prefix ? <div className="mr-2">{prefix}</div> : null}
      <div>
        {bignumberToFormat({
          value: amount,
          exponent: 6,
          field: { type: 'bignumber', label: '', value: '' } as ListFieldBignumber,
        })}
      </div>
      {tag ? <Tag>{tag}</Tag> : null}
    </div>
  )
}
