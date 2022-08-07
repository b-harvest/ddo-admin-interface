import FoldableSection from 'components/FordableSection'
import TableList from 'components/TableList'
import TimestampMemo from 'components/TimestampMemo'
import useAccountData from 'hooks/useAccountData'
import useAsset from 'hooks/useAsset'
import usePool from 'hooks/usePool'
import AccountDataAlertArea from 'pages/Account/components/AccountDataAlertArea'
import AssetLogoLabel from 'pages/components/AssetLogoLabel'
import { useMemo } from 'react'
import type { AlertStatus } from 'types/alert'
import { isTimeDiffFromNowMoreThan } from 'utils/time'

export default function FarmStakedAmount({
  address,
  significantTimeGap,
}: {
  address: string | undefined
  significantTimeGap: number
}) {
  const { findAssetByDenom } = useAsset()
  const { findPoolByDenom, getAssetTickers } = usePool()

  const { allStakedDataTimestamp, allStaked, farmPositionLCD } = useAccountData({
    address: address ?? '',
    interval: 5000,
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
      const assetLabel = asset ? AssetLogoLabel({ assets: getAssetTickers(asset), poolDenom: item.denom }) : null
      const poolId = findPoolByDenom(item.denom)?.poolId

      const priceOracle = findPoolByDenom(item.denom)?.priceOracle
      const onchainStakedUSD = onchainStakedAmount.multipliedBy(priceOracle ?? 0)

      return {
        onchainStakedAmount,
        backendStakedAmount,
        onchainStakedUSD,
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
      const assetLabel = asset ? AssetLogoLabel({ assets: getAssetTickers(asset), poolDenom: item.denom }) : null
      const poolId = findPoolByDenom(item.denom)?.poolId

      const priceOracle = findPoolByDenom(item.denom)?.priceOracle
      const onchainQueuedUSD = onchainQueuedAmount.multipliedBy(priceOracle ?? 0)

      return {
        onchainQueuedAmount,
        backendQueuedAmount,
        onchainQueuedUSD,
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
          memo={<TimestampMemo label="Back-end last synced" timestamp={allStakedDataTimestamp} />}
          showTitle={false}
          useSearch={false}
          showFieldsBar={true}
          list={farmStakedList}
          mergedFields={[['onchainStakedAmount', 'backendStakedAmount'], ['onchainStakedUSD']]}
          mergedFieldLabels={['Staked amount', 'Staked amount (≈)']}
          defaultSortBy="onchainStakedAmount"
          defaultIsSortASC={false}
          totalField="onchainStakedUSD"
          totalLabel="Total"
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
            {
              label: 'Staked USD (≈)',
              value: 'onchainStakedUSD',
              type: 'usd',
              toFixedFallback: 2,
              responsive: true,
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
          memo={<TimestampMemo label="Back-end last synced" timestamp={allStakedDataTimestamp} />}
          showTitle={false}
          useSearch={false}
          showFieldsBar={true}
          list={farmQueuedList}
          mergedFields={[['onchainQueuedAmount', 'backendQueuedAmount'], ['onchainQueuedUSD']]}
          mergedFieldLabels={['Queued amount', 'Queued amount (≈)']}
          defaultSortBy="onchainQueuedAmount"
          defaultIsSortASC={false}
          totalField="onchainQueuedUSD"
          totalLabel="Total"
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
            {
              label: 'Queued USD (≈)',
              value: 'onchainQueuedUSD',
              type: 'usd',
              toFixedFallback: 2,
              responsive: true,
            },
          ]}
        />
      </div>
    </FoldableSection>
  )
}
