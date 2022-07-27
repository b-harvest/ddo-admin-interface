import BigNumber from 'bignumber.js'
import FoldableSection from 'components/FordableSection'
import TableList from 'components/TableList'
import useAccountData from 'hooks/useAccountData'
import useAsset from 'hooks/useAsset'
import usePair from 'hooks/usePair'
import usePool from 'hooks/usePool'
import AccountDataAlertArea from 'pages/Accounts/components/AccountDataAlertArea'
import AssetTableLogoCell from 'pages/components/AssetTableLogoCell'
import { useMemo } from 'react'
import type { AlertStatus } from 'types/alert'
import { isTimeDiffFromNowMoreThan } from 'utils/time'

export default function FarmStakedAmount({
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

  const { allStakedDataTimestamp, allStaked, farmPositionLCD } = useAccountData({
    address: address ?? '',
    interval,
  })

  const { stakedTableList, hasStakedDiff } = useMemo(() => {
    // const onchainStakedMap = allStakedLCD
    //   .filter((item) => item.starting_epoch === '4' || item.starting_epoch === undefined) // ?
    //   .reduce((accm, item) => ({ ...accm, [item.denom]: item }), {})

    const onchainStakedAmtMap = farmPositionLCD.staked_coins.reduce(
      (accm, item) => ({ ...accm, [item.denom]: item }),
      {}
    )
    const onchainQueuedAmtMap = farmPositionLCD.queued_coins.reduce(
      (accm, item) => ({ ...accm, [item.denom]: item }),
      {}
    )

    const stakedTableList = allStaked
      .filter((item) => findAssetByDenom(item.denom) !== undefined)
      .map((item) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const assetInfo = findAssetByDenom(item.denom)!
        const asset = AssetTableLogoCell({ assets: getAssetTickers(assetInfo), poolDenom: item.denom })
        const onchainStakedAmount = onchainStakedAmtMap[item.denom]?.amount ?? new BigNumber(0)
        const onchainQueuedAmount = onchainQueuedAmtMap[item.denom]?.amount ?? new BigNumber(0)

        const status: AlertStatus | undefined = item.stakedAmount.isEqualTo(onchainStakedAmount) ? undefined : 'error'

        return {
          asset,
          ...item,
          poolId: findPoolByDenom(item.denom)?.poolId,
          onchainStakedAmount,
          onchainQueuedAmount,
          status,
        }
      })

    const hasStakedDiff = stakedTableList.findIndex((item) => item.status === 'error') > -1

    return { stakedTableList, hasStakedDiff }
  }, [allStaked, farmPositionLCD, findAssetByDenom, getAssetTickers, findPoolByDenom])

  // alert-inline data - staked amount
  const { isStakedDataTimeDiff, isStakedDataAllMatched } = useMemo(() => {
    const isStakedDataTimeDiff = isTimeDiffFromNowMoreThan(allStakedDataTimestamp, significantTimeGap)
    const isStakedDataAllMatched = !hasStakedDiff && !isStakedDataTimeDiff

    return {
      isStakedDataTimeDiff,
      isStakedDataAllMatched,
    }
  }, [allStakedDataTimestamp, hasStakedDiff, significantTimeGap])

  return (
    <FoldableSection label="Farm Staked Amount" defaultIsOpen={true}>
      <AccountDataAlertArea
        isActive={stakedTableList.length > 0}
        significantTimeGap={significantTimeGap}
        isDataTimeDiff={isStakedDataTimeDiff}
        isDataNotMatched={hasStakedDiff}
        isAllDataMatched={isStakedDataAllMatched}
      />

      <div className="mt-8">
        <TableList
          title="Farm Staked Amount"
          showTitle={false}
          useSearch={false}
          showFieldsBar={true}
          list={stakedTableList}
          mergedFields={['stakedAmount', 'onchainStakedAmount']}
          mergedFieldLabel="Staked amount"
          defaultSortBy="onchainStakedAmount"
          defaultIsSortASC={false}
          nowrap={false}
          fields={[
            {
              label: 'Pool',
              value: 'asset',
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
              label: 'Backend queued amount',
              value: 'queuedAmount',
              tag: 'Back-end',
              type: 'bignumber',
              toFixedFallback: 6,
              responsive: true,
            },
            {
              label: 'Onchain queued amount',
              value: 'onchainQueuedAmount',
              tag: 'On-chain',
              type: 'bignumber',
              toFixedFallback: 6,
              responsive: true,
            },
            {
              label: 'Backend amount',
              value: 'stakedAmount',
              tag: 'Back-end',
              type: 'bignumber',
              toFixedFallback: 6,
            },
            {
              label: 'Onchain amount',
              value: 'onchainStakedAmount',
              tag: 'On-chain',
              type: 'bignumber',
              toFixedFallback: 6,
            },
          ]}
        />
      </div>
    </FoldableSection>
  )
}
