import EmptyData from 'components/EmptyData'
import FoldableSection from 'components/FordableSection'
import TableList from 'components/TableList'
import TimestampMemo from 'components/TimestampMemo'
import useAsset from 'hooks/useAsset'
import usePool from 'hooks/usePool'
import AccountDataAlertArea from 'pages/Account/components/AccountDataAlertArea'
import AssetLogoLabel from 'pages/components/AssetLogoLabel'
import { useMemo } from 'react'
import type { LpFarmStaking, TokenAmountSet } from 'types/account'
import type { AlertStatus } from 'types/alert'
import { isTimeDiffFromNowMoreThan } from 'utils/time'

export default function FarmStakedAmount({
  significantTimeGap,
  backendTimestamp,
  backendData,
  onchainData,
  isLoading = true,
}: {
  significantTimeGap: number
  backendTimestamp: number
  backendData: LpFarmStaking[]
  onchainData: TokenAmountSet[]
  isLoading: boolean
}) {
  const { findAssetByDenom } = useAsset()
  const { findPoolByDenom, getAssetTickers } = usePool()

  const farmingList = useMemo(() => {
    return onchainData.map((item) => {
      const onchainFarmedAmount = item.amount
      const backendFarmedAmount = backendData.find((pool) => pool.denom === item.denom)?.stakedAmount
      const status: AlertStatus | undefined = backendFarmedAmount
        ? onchainFarmedAmount.isEqualTo(backendFarmedAmount)
          ? undefined
          : 'error'
        : 'error'

      const asset = findAssetByDenom(item.denom)
      const assetLabel = asset ? AssetLogoLabel({ assets: getAssetTickers(asset), poolDenom: item.denom }) : null
      const poolId = findPoolByDenom(item.denom)?.poolId

      const priceOracle = findPoolByDenom(item.denom)?.priceOracle
      const onchainFarmedUSD = onchainFarmedAmount.multipliedBy(priceOracle ?? 0)

      return {
        onchainFarmedAmount,
        backendFarmedAmount,
        onchainFarmedUSD,
        status,
        ...asset,
        assetLabel,
        poolId,
      }
    })
  }, [backendData, onchainData, findAssetByDenom, findPoolByDenom, getAssetTickers])

  // alert-inline data - balance
  const isDelayed = useMemo<boolean>(
    () => isTimeDiffFromNowMoreThan(backendTimestamp, significantTimeGap),
    [backendTimestamp, significantTimeGap]
  )

  const hasStakedDiff = useMemo<boolean>(
    () => farmingList.findIndex((item) => item.status === 'error') > -1,
    [farmingList]
  )

  const allStakedMatched = useMemo<boolean>(() => !hasStakedDiff && !isDelayed, [hasStakedDiff, isDelayed])

  return (
    <FoldableSection label="Farming" defaultIsOpen={true}>
      {isLoading ? (
        <EmptyData isLoading={true} />
      ) : (
        <>
          <AccountDataAlertArea
            isActive={farmingList.length > 0}
            significantTimeGap={significantTimeGap}
            isDataTimeDiff={isDelayed}
            isDataNotMatched={hasStakedDiff}
            isAllDataMatched={allStakedMatched}
          />

          <div className="mt-8">
            <TableList
              title="Farming"
              memo={<TimestampMemo label="Back-end last synced" timestamp={backendTimestamp} />}
              showTitle={false}
              useSearch={false}
              showFieldsBar={true}
              list={farmingList}
              mergedFields={[['onchainFarmedAmount', 'backendFarmedAmount'], ['onchainFarmedUSD']]}
              mergedFieldLabels={['Farmed amount', '(≈)']}
              defaultSortBy="onchainFarmedAmount"
              defaultIsSortASC={false}
              totalField="onchainFarmedUSD"
              totalLabel="Total"
              nowrap={false}
              fields={[
                {
                  label: 'Pool',
                  value: 'assetLabel',
                  type: 'html',
                  widthRatio: 24,
                },
                {
                  label: 'Pool #',
                  value: 'poolId',
                  widthRatio: 12,
                  responsive: true,
                },
                {
                  label: 'Onchain amount',
                  value: 'onchainFarmedAmount',
                  tag: 'On-chain',
                  type: 'bignumber',
                  toFixedFallback: 6,
                },
                {
                  label: 'Backend amount',
                  value: 'backendFarmedAmount',
                  tag: 'Back-end',
                  type: 'bignumber',
                  toFixedFallback: 6,
                },
                {
                  label: '(≈)',
                  value: 'onchainFarmedUSD',
                  type: 'usd',
                  toFixedFallback: 2,
                  // responsive: true,
                },
              ]}
            />
          </div>

          {/* <div className="space-y-6 mt-20">
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
              memo={<TimestampMemo label="Back-end last synced" timestamp={backendTimestamp} />}
              showTitle={false}
              useSearch={false}
              showFieldsBar={true}
              list={farmQueuedList}
              mergedFields={[['onchainQueuedAmount', 'backendQueuedAmount'], ['onchainQueuedUSD']]}
              mergedFieldLabels={['Queued amount', '(≈)']}
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
                  label: '(≈)',
                  value: 'onchainQueuedUSD',
                  type: 'usd',
                  toFixedFallback: 2,
                },
              ]}
            />
          </div> */}
        </>
      )}
    </FoldableSection>
  )
}
