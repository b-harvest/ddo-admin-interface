import FoldableSection from 'components/FordableSection'
import TableList from 'components/TableList'
import useAccountData from 'hooks/useAccountData'
import useAsset from 'hooks/useAsset'
import usePair from 'hooks/usePair'
import usePool from 'hooks/usePool'
import AccountDataAlertArea from 'pages/Account/components/AccountDataAlertArea'
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

  const farmStakedList = useMemo(() => {
    return farmPositionLCD.staked_coins.map((item) => {
      const onchainStakedAmount = item.amount
      const backendStakedAmount = allStaked.find((pool) => pool.denom === item.denom)?.stakedAmount
      const status: AlertStatus | undefined = backendStakedAmount
        ? onchainStakedAmount.isEqualTo(backendStakedAmount)
          ? undefined
          : 'error'
        : 'error'

      const asset = findAssetByDenom(item.denom)
      const assetLabel = asset ? AssetTableLogoCell({ assets: getAssetTickers(asset), poolDenom: item.denom }) : null
      const poolId = findPoolByDenom(item.denom)?.poolId

      return {
        onchainStakedAmount,
        backendStakedAmount,
        status,
        ...asset,
        assetLabel,
        poolId,
      }
    })
  }, [allStaked, farmPositionLCD, findAssetByDenom, findPoolByDenom, getAssetTickers])

  const farmQueuedList = useMemo(() => {
    return farmPositionLCD.queued_coins.map((item) => {
      const onchainQueuedAmount = item.amount
      const backendQueuedAmount = allStaked.find((pool) => pool.denom === item.denom)?.queuedAmount
      const status: AlertStatus | undefined = backendQueuedAmount
        ? onchainQueuedAmount.isEqualTo(backendQueuedAmount)
          ? undefined
          : 'error'
        : 'error'

      const asset = findAssetByDenom(item.denom)
      const assetLabel = asset ? AssetTableLogoCell({ assets: getAssetTickers(asset), poolDenom: item.denom }) : null
      const poolId = findPoolByDenom(item.denom)?.poolId

      return {
        onchainQueuedAmount,
        backendQueuedAmount,
        status,
        ...asset,
        assetLabel,
        poolId,
      }
    })
  }, [allStaked, farmPositionLCD, findAssetByDenom, findPoolByDenom, getAssetTickers])

  // alert-inline data - balance
  const isDelayed = useMemo<boolean>(
    () => isTimeDiffFromNowMoreThan(allStakedDataTimestamp, significantTimeGap),
    [allStakedDataTimestamp, significantTimeGap]
  )

  const hasStakedDiff = useMemo<boolean>(
    () => farmStakedList.findIndex((item) => item.status === 'error') > -1,
    [farmStakedList]
  )

  const allStakedMatched = useMemo<boolean>(() => !hasStakedDiff && !isDelayed, [hasStakedDiff, isDelayed])

  const hasQueuedDiff = useMemo<boolean>(
    () => farmQueuedList.findIndex((item) => item.status === 'error') > -1,
    [farmQueuedList]
  )

  const allQueuedMatched = useMemo<boolean>(() => !hasQueuedDiff && !isDelayed, [hasQueuedDiff, isDelayed])

  return (
    <FoldableSection label="Farm Staked Amount" defaultIsOpen={true}>
      <AccountDataAlertArea
        isActive={farmStakedList.length > 0}
        significantTimeGap={significantTimeGap}
        isDataTimeDiff={isDelayed}
        isDataNotMatched={hasStakedDiff}
        isAllDataMatched={allStakedMatched}
      />

      <div className="mt-8">
        <TableList
          title="Farm Staked Amount"
          showTitle={false}
          useSearch={false}
          showFieldsBar={true}
          list={farmStakedList}
          mergedFields={[['onchainStakedAmount', 'backendStakedAmount']]}
          mergedFieldLabels={['Staked amount']}
          defaultSortBy="onchainStakedAmount"
          defaultIsSortASC={false}
          nowrap={false}
          fields={[
            {
              label: 'Pool',
              value: 'assetLabel',
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
              label: 'Onchain amount',
              value: 'onchainStakedAmount',
              tag: 'On-chain',
              type: 'bignumber',
              toFixedFallback: 6,
            },
            {
              label: 'Backend amount',
              value: 'backendStakedAmount',
              tag: 'Back-end',
              type: 'bignumber',
              toFixedFallback: 6,
            },
          ]}
        />
      </div>

      <div className="space-y-6 mt-20">
        <h3 className="flex justify-start items-center TYPO-H3 text-black dark:text-white text-left">Queued</h3>

        <AccountDataAlertArea
          isActive={farmQueuedList.length > 0}
          significantTimeGap={significantTimeGap}
          isDataTimeDiff={isDelayed}
          isDataNotMatched={hasQueuedDiff}
          isAllDataMatched={allQueuedMatched}
        />

        <TableList
          title="Queued"
          showTitle={false}
          useSearch={false}
          showFieldsBar={true}
          list={farmQueuedList}
          mergedFields={[['onchainQueuedAmount', 'backendQueuedAmount']]}
          mergedFieldLabels={['Queued amount']}
          defaultSortBy="onchainQueuedAmount"
          defaultIsSortASC={false}
          nowrap={false}
          fields={[
            {
              label: 'Pool',
              value: 'assetLabel',
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
              label: 'Onchain amount',
              value: 'onchainQueuedAmount',
              tag: 'On-chain',
              type: 'bignumber',
              toFixedFallback: 6,
            },
            {
              label: 'Backend amount',
              value: 'backendQueuedAmount',
              tag: 'Back-end',
              type: 'bignumber',
              toFixedFallback: 6,
            },
          ]}
        />
      </div>
    </FoldableSection>
  )
}
