import BigNumber from 'bignumber.js'
import EmptyData from 'components/EmptyData'
import FoldableSection from 'components/FordableSection'
import TableList, { bignumberToFormat } from 'components/TableList'
import type { ListFieldBignumber } from 'components/TableList/types'
import Tag from 'components/Tag'
import useAccountData from 'hooks/useAccountData'
import useAsset from 'hooks/useAsset'
import usePair from 'hooks/usePair'
import usePool from 'hooks/usePool'
import AccountDataAlertArea from 'pages/Accounts/components/AccountDataAlertArea'
import AssetTableLogoCell from 'pages/components/AssetTableLogoCell'
import { useMemo } from 'react'
import { AlertStatus } from 'types/alert'
import { isTimeDiffFromNowMoreThan } from 'utils/time'

export default function ClaimableRewards({
  address,
  significantTimeGap,
  interval = 0,
}: {
  address: string | undefined
  significantTimeGap: number
  interval?: number
}) {
  const { findAssetByDenom } = useAsset()
  const { getAssetTickers } = usePair()
  const { findPoolByDenom } = usePool()

  const { allFarmRewardsDataTimestamp, allFarmRewardsByToken, allFarmRewardsByTokenLCD } = useAccountData({
    address: address ?? '',
    interval,
  })

  const rewardsListByToken = useMemo<any[][]>(() => {
    return Object.keys(allFarmRewardsByTokenLCD).map((denom) => {
      const onchainList = allFarmRewardsByTokenLCD[denom]
      const backendList = allFarmRewardsByToken[denom] ?? []

      const onchainTotal = onchainList.reduce((accm, item) => accm.plus(item.amount), new BigNumber(0))
      const backendTotal = backendList.reduce((accm, item) => accm.plus(item.amount), new BigNumber(0))

      return onchainList.map((item) => {
        const onchainRewardsAmount = item.amount
        const backendRewardsAmount = backendList.find((pool) => pool.poolDenom === item.poolDenom)?.amount

        const poolAsset = findAssetByDenom(item.poolDenom)
        const poolLabel = poolAsset
          ? AssetTableLogoCell({ assets: getAssetTickers(poolAsset), poolDenom: item.poolDenom })
          : undefined
        const poolId = findPoolByDenom(item.poolDenom)?.poolId

        const rewardsAsset = findAssetByDenom(item.denom)
        const rewardsAssetLabel = rewardsAsset
          ? AssetTableLogoCell({
              assets: getAssetTickers(rewardsAsset),
              isSingleAssetAutoSpaced: true,
              nowrap: true,
            })
          : undefined
        const rewardsAssetLogo = rewardsAsset
          ? AssetTableLogoCell({
              assets: getAssetTickers(rewardsAsset),
              hideTicker: true,
            })
          : undefined

        const totalDesc = TableTotalDesc({ amount: backendTotal, prefix: rewardsAssetLogo, tag: 'Back-end' })
        const totalStatus: AlertStatus | undefined = onchainTotal.isEqualTo(backendTotal) ? undefined : 'error'

        return {
          onchainRewardsAmount,
          backendRewardsAmount,
          poolLabel,
          poolId,
          rewardsAssetLabel,
          rewardsAssetLogo,
          totalDesc,
          totalStatus,
        }
      })
    })
  }, [allFarmRewardsByTokenLCD, allFarmRewardsByToken, findAssetByDenom, getAssetTickers, findPoolByDenom])

  const hasDiff = useMemo<boolean>(
    () => rewardsListByToken.findIndex((listByToken) => listByToken[0] && listByToken[0].totalStatus === 'error') > -1,
    [rewardsListByToken]
  )

  // alert-inline data - balance
  const isDelayed = useMemo<boolean>(
    () => isTimeDiffFromNowMoreThan(allFarmRewardsDataTimestamp, significantTimeGap),
    [allFarmRewardsDataTimestamp, significantTimeGap]
  )

  const allMatched = useMemo<boolean>(() => !hasDiff && !isDelayed, [hasDiff, isDelayed])

  return (
    <FoldableSection label="Claimable Rewards" defaultIsOpen={true}>
      <AccountDataAlertArea
        isActive={rewardsListByToken.length > 0}
        significantTimeGap={significantTimeGap}
        isDataTimeDiff={isDelayed}
        isDataNotMatched={hasDiff}
        isAllDataMatched={allMatched}
      />

      <div className="mt-8">
        {rewardsListByToken.length > 0 ? (
          rewardsListByToken.map((listByToken, i) =>
            listByToken.length ? (
              <div key={i}>
                <h4 className="flex justify-start items-center space-x-2 TYPO-H4 text-black dark:text-white mb-4">
                  <span>Rewarding</span>
                  <span>{listByToken[0].rewardsAssetLabel}</span>
                </h4>

                <TableList
                  title="Claimabale Rewards"
                  showTitle={false}
                  useSearch={false}
                  showFieldsBar={true}
                  list={listByToken}
                  mergedFields={['onchainRewardsAmount', 'backendRewardsAmount']}
                  mergedFieldLabel="Rewards amount"
                  defaultSortBy="rewardsAmount"
                  defaultIsSortASC={false}
                  totalField="onchainRewardsAmount"
                  totalLabel="Total rewards"
                  totalPrefixDesc={listByToken[0].rewardsAssetLogo}
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
    </FoldableSection>
  )
}

function TableTotalDesc({ amount, tag, prefix }: { amount: BigNumber; tag?: string; prefix?: JSX.Element }) {
  return (
    <div className="flex space-x-2 !font-black FONT-MONO">
      <div className="mr-2">{prefix ?? null}</div>
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
