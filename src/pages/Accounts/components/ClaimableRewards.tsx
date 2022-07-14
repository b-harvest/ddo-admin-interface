import BigNumber from 'bignumber.js'
import EmptyData from 'components/EmptyData'
import FoldableSection from 'components/FordableSection'
import TableList, { bignumberToFormat } from 'components/TableList'
import type { ListFieldBignumber } from 'components/TableList/types'
import Tag from 'components/Tag'
import useAccountData from 'hooks/useAccountData'
import useAsset from 'hooks/useAsset'
import usePair from 'hooks/usePair'
import AccountDataAlertArea from 'pages/Accounts/components/AccountDataAlertArea'
import AssetTableLogoCell from 'pages/components/AssetTableLogoCell'
import { useMemo } from 'react'
import { AlertStatus } from 'types/alert'
import { isTimeDiffFromNowMoreThan } from 'utils/time'

export default function ClaimableRewards({
  address,
  significantTimeGap,
}: {
  address: string | undefined
  significantTimeGap: number
}) {
  const { findAssetByDenom } = useAsset()
  const { getAssetTickers } = usePair()

  const { allFarmRewardsDataTimestamp, allFarmRewardsByToken, allFarmRewardsByTokenLCD } = useAccountData(address ?? '')

  console.log('allFarmRewardsByToken', allFarmRewardsByToken)
  console.log('allFarmRewardsByTokenLCD', allFarmRewardsByTokenLCD)

  const { rewardsTablesByRewardsToken, hasRewardsDiff } = useMemo(() => {
    const rewardsTablesByRewardsToken = Object.keys(allFarmRewardsByToken)
      .filter((denom) => findAssetByDenom(denom) !== undefined)
      .map((denom) => {
        const onchainList = allFarmRewardsByTokenLCD[denom] ?? []
        const onchainTotal = onchainList.reduce((accm, data) => accm.plus(data.amount), new BigNumber(0))
        const backendTotal = allFarmRewardsByToken[denom].reduce(
          (accm, data) => accm.plus(data.amount),
          new BigNumber(0)
        )

        return allFarmRewardsByToken[denom]
          .filter((item) => findAssetByDenom(item.poolDenom) !== undefined)
          .map((item) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const poolAssetInfo = findAssetByDenom(item.poolDenom)!
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const rewardAssetInfo = findAssetByDenom(item.denom)!

            const pool = AssetTableLogoCell({ assets: getAssetTickers(poolAssetInfo) })
            const rewardToken = AssetTableLogoCell({
              assets: getAssetTickers(rewardAssetInfo),
              isSingleAssetAutoSpaced: true,
            })
            const rewardTokenLogo = AssetTableLogoCell({
              assets: getAssetTickers(rewardAssetInfo),
              hideTicker: true,
            })

            const rewardsAmountLCD = onchainList.find((lcd) => lcd.poolDenom === item.poolDenom)?.amount ?? null

            const totalDesc = TableTotalDesc({ amount: onchainTotal, prefix: rewardTokenLogo, tag: 'On-chain' })
            const totalStatus: AlertStatus | undefined = onchainTotal.isEqualTo(backendTotal) ? undefined : 'error'

            return {
              pool,
              poolDenom: item.poolDenom,
              rewardToken,
              rewardTokenLogo,
              rewardDenom: item.denom,
              rewardsAmount: item.amount,
              rewardsAmountLCD,
              totalDesc,
              totalStatus,
            }
          })
      })

    const hasRewardsDiff =
      rewardsTablesByRewardsToken.findIndex((tableList) => tableList[0].totalStatus === 'error') > -1

    return { rewardsTablesByRewardsToken, hasRewardsDiff }
  }, [allFarmRewardsByToken, allFarmRewardsByTokenLCD, findAssetByDenom, getAssetTickers])

  // alert-inline data - staked amount
  const { isRewardsDataTimeDiff, isRewardsDataAllMatched } = useMemo(() => {
    const isRewardsDataTimeDiff = isTimeDiffFromNowMoreThan(allFarmRewardsDataTimestamp, significantTimeGap)
    const isRewardsDataAllMatched = !hasRewardsDiff && !isRewardsDataTimeDiff
    // const isRewardsDataAllMatched = !isRewardsDataTimeDiff

    return {
      isRewardsDataTimeDiff,
      isRewardsDataAllMatched,
    }
  }, [allFarmRewardsDataTimestamp, hasRewardsDiff, significantTimeGap])

  return (
    <FoldableSection label="Claimable Rewards" defaultIsOpen={false}>
      <AccountDataAlertArea
        isActive={rewardsTablesByRewardsToken.length > 0}
        significantTimeGap={significantTimeGap}
        isDataTimeDiff={isRewardsDataTimeDiff}
        isDataNotMatched={hasRewardsDiff}
        isAllDataMatched={isRewardsDataAllMatched}
      />

      <div className="mt-8">
        {rewardsTablesByRewardsToken.length > 0 ? (
          rewardsTablesByRewardsToken.map((tableList, i) => (
            <div key={i}>
              <h4 className="flex justify-start items-center space-x-2 TYPO-H4 text-black dark:text-white mb-4">
                <span>Pools rewarding</span>
                {tableList[0].rewardToken}
              </h4>
              <TableList
                title="Claimabale Rewards"
                showTitle={false}
                useSearch={false}
                showFieldsBar={true}
                list={tableList}
                mergedFields={['rewardsAmount', 'rewardsAmountLCD']}
                mergedFieldLabel="Rewards amount"
                defaultSortBy="rewardsAmount"
                defaultIsSortASC={false}
                totalField="rewardsAmount"
                totalLabel="Total rewards"
                totalPrefixDesc={tableList[0].rewardTokenLogo}
                totalDesc={tableList[0].totalDesc}
                totalStatus={tableList[0].totalStatus}
                showItemsVertically={false}
                fields={[
                  {
                    label: 'Pool',
                    value: 'pool',
                    type: 'html',
                    widthRatio: 30,
                  },
                  {
                    label: 'Denom',
                    value: 'poolDenom',
                    widthRatio: 10,
                  },
                  // {
                  //   label: 'Rewards Token',
                  //   value: 'rewardToken',
                  //   type: 'html',
                  //   widthRatio: 12,
                  // },
                  {
                    label: 'Rewards amount',
                    value: 'rewardsAmount',
                    tag: 'Back-end',
                    type: 'bignumber',
                    toFixedFallback: 6,
                  },
                  {
                    label: 'On-chain rewards amount',
                    value: 'rewardsAmountLCD',
                    tag: 'On-chain',
                    type: 'bignumber',
                    toFixedFallback: 6,
                  },
                ]}
              />
            </div>
          ))
        ) : (
          <EmptyData label="No data" />
        )}
      </div>
    </FoldableSection>
  )
}

function TableTotalDesc({ amount, tag, prefix }: { amount: BigNumber; tag?: string; prefix?: JSX.Element }) {
  return (
    <div className="flex space-x-2 !font-black !font-mono">
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
