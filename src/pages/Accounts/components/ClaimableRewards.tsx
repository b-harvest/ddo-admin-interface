import BigNumber from 'bignumber.js'
import AlertBox from 'components/AlertBox'
import FoldableSection from 'components/FordableSection'
import TableList from 'components/TableList'
import { ERROR_MSG_BACKEND_TIMESTAMP_DIFF, SUCCESS_MSG_ALL_DATA_MATCHED } from 'constants/msg'
import useAccountData from 'hooks/useAccountData'
import useAsset from 'hooks/useAsset'
import usePair from 'hooks/usePair'
import AssetTableLogoCell from 'pages/components/AssetTableLogoCell'
import { useMemo } from 'react'
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

  const { allStakedDataTimestamp, allStaked, allStakedLCD, allFarmRewards, allFarmRewardsLCD } = useAccountData(
    address ?? ''
  )

  console.log('allFarmRewardsLCD', allFarmRewardsLCD)

  const { rewardsTableList } = useMemo(() => {
    // const onchainRewardsMap = allFarmRewardsLCD.reduce((accm, item) => ({ ...accm, [item.denom]: item.amount }), {})

    const rewardsTableList = allFarmRewards
      .filter((item) => findAssetByDenom(item.denom) !== undefined && findAssetByDenom(item.poolDenom) !== undefined)
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

        return {
          pool,
          poolDenom: item.poolDenom,
          rewardToken,
          rewardDenom: item.denom,
          rewardsAmount: item.amount,
        }
      })

    return { rewardsTableList }
  }, [allFarmRewards, findAssetByDenom, getAssetTickers])

  // alert-inline data - staked amount
  const { isRewardsDataTimeDiff, isRewardsDataAllMatched } = useMemo(() => {
    const isRewardsDataTimeDiff = isTimeDiffFromNowMoreThan(allStakedDataTimestamp, significantTimeGap)
    // const isRewardsDataAllMatched = !hasRewardsDiff && !isRewardsDataTimeDiff
    const isRewardsDataAllMatched = !isRewardsDataTimeDiff

    return {
      isRewardsDataTimeDiff,
      isRewardsDataAllMatched,
    }
  }, [allStakedDataTimestamp, significantTimeGap])

  return (
    <FoldableSection label="Claimable Rewards" defaultIsOpen={false}>
      <div
        className={`${
          rewardsTableList.length > 0 ? 'block' : 'hidden opacity-0'
        } flex flex-col justify-start items-start mb-4 transition-opacity`}
      >
        <div className="flex flex-col space-y-2 w-full mt-4">
          <AlertBox
            msg={`${ERROR_MSG_BACKEND_TIMESTAMP_DIFF} ≧ ${new BigNumber(significantTimeGap).toFormat(0)}ms`}
            status="error"
            isActive={isRewardsDataTimeDiff}
          />
          <AlertBox msg={SUCCESS_MSG_ALL_DATA_MATCHED} status="success" isActive={isRewardsDataAllMatched} />
        </div>
      </div>

      <TableList
        title="Claimabale Rewards"
        showTitle={false}
        useSearch={false}
        showFieldsBar={true}
        list={rewardsTableList}
        mergedFields={['rewardsAmount']}
        mergedFieldLabel="Rewards Amount"
        defaultSortBy="rewardsAmount"
        defaultIsSortASC={false}
        totalField="rewardsAmount"
        showItemsVertically={false}
        fields={[
          {
            label: 'Pool',
            value: 'pool',
            type: 'html',
            widthRatio: 24,
          },
          {
            label: 'Denom',
            value: 'poolDenom',
            widthRatio: 10,
          },
          {
            label: 'Rewards Token',
            value: 'rewardToken',
            type: 'html',
            widthRatio: 20,
          },
          {
            label: 'Rewards Amount',
            value: 'rewardsAmount',
            tag: 'Back-end',
            type: 'bignumber',
            toFixedFallback: 6,
          },
        ]}
      />
      {/* {(allFarmRewardsLCD?.[0] as LCDTokenAmountSet).amount.toFormat()} */}
    </FoldableSection>
  )
}
