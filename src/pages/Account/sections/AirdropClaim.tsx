import BigNumber from 'bignumber.js'
import EmptyData from 'components/EmptyData'
import FoldableSection from 'components/FordableSection'
import TableList from 'components/TableList'
import TimestampMemo from 'components/TimestampMemo'
import useAsset from 'hooks/useAsset'
import usePool from 'hooks/usePool'
import AccountDataAlertArea from 'pages/Account/components/AccountDataAlertArea'
import AssetLogoLabel from 'pages/components/AssetLogoLabel'
import { useMemo } from 'react'
import type { AirdropClaim, AirdropClaimLCD } from 'types/account'
import type { AlertStatus } from 'types/alert'
import { isTimeDiffFromNowMoreThan } from 'utils/time'

export default function AirdropClaimSection({
  significantTimeGap,
  backendTimestamp,
  backendData,
  onchainData,
  isLoading = true,
}: {
  significantTimeGap: number
  backendTimestamp: number
  backendData: AirdropClaim | null
  onchainData: AirdropClaimLCD | null
  isLoading: boolean
}) {
  const { findAssetByDenom } = useAsset()
  const { getAssetTickers } = usePool()

  const airdropList = useMemo<any[]>(() => {
    return (
      onchainData?.initial_claimable_coins.map((item) => {
        const onchainInitAmount = item.amount
        const backendInitAmount = backendData
          ? backendData.initialClaimableCoins.find((air) => air.denom === item.denom)?.amount ?? new BigNumber(0)
          : undefined
        const onchainClaimableAmount = onchainData
          ? onchainData.claimable_coins.find((air) => air.denom === item.denom)?.amount ?? new BigNumber(0)
          : undefined
        const backendClaimableAmount = backendData
          ? backendData.claimableCoins.find((air) => air.denom === item.denom)?.amount ?? new BigNumber(0)
          : undefined
        const status: AlertStatus | undefined =
          backendInitAmount && onchainInitAmount.isEqualTo(backendInitAmount) ? undefined : 'error'

        const asset = findAssetByDenom(item.denom)
        const assetLabel = asset
          ? AssetLogoLabel({
              assets: getAssetTickers(asset),
              poolDenom: item.denom,
              isSingleAssetAutoSpaced: true,
            })
          : null

        return {
          onchainInitAmount,
          backendInitAmount,
          onchainClaimableAmount,
          backendClaimableAmount,
          status,
          assetLabel,
          airdropId: onchainData.airdrop_id,
        }
      }) ?? []
    )
  }, [backendData, onchainData, findAssetByDenom, getAssetTickers])

  const hasDiff = useMemo<boolean>(() => airdropList.findIndex((item) => item.status === 'error') > -1, [airdropList])

  // alert-inline data - AirdropClaim amount
  const isDelayed = useMemo<boolean>(
    () => isTimeDiffFromNowMoreThan(backendTimestamp, significantTimeGap),
    [backendTimestamp, significantTimeGap]
  )

  const allMatched = useMemo<boolean>(() => !hasDiff && !isDelayed, [hasDiff, isDelayed])

  return (
    <FoldableSection label="Airdrop" defaultIsOpen={true}>
      {isLoading ? (
        <EmptyData isLoading={true} />
      ) : (
        <>
          <AccountDataAlertArea
            isActive={airdropList.length > 0}
            significantTimeGap={significantTimeGap}
            isDataTimeDiff={isDelayed}
            isDataNotMatched={hasDiff}
            isAllDataMatched={allMatched}
          />

          <div className="mt-8">
            <TableList
              title={`Airdrop ${backendData?.AirdropId ?? ''}`}
              memo={<TimestampMemo label="Back-end last synced" timestamp={backendTimestamp} />}
              showTitle={false}
              useSearch={false}
              showFieldsBar={true}
              list={airdropList}
              mergedFields={[
                ['onchainInitAmount', 'backendInitAmount'],
                ['onchainClaimableAmount', 'backendClaimableAmount'],
              ]}
              mergedFieldLabels={['Initial amount', 'Claimable amount']}
              defaultSortBy="onchainInitAmount"
              defaultIsSortASC={false}
              nowrap={false}
              fields={[
                {
                  label: 'Token',
                  value: 'assetLabel',
                  type: 'html',
                  widthRatio: 18,
                },
                {
                  label: 'Airdrop #',
                  value: 'airdropId',
                  widthRatio: 12,
                  responsive: true,
                },
                {
                  label: 'Onchain claimable',
                  value: 'onchainClaimableAmount',
                  tag: 'On-chain',
                  type: 'bignumber',
                  toFixedFallback: 6,
                },
                {
                  label: 'Backend claimable',
                  value: 'backendClaimableAmount',
                  tag: 'Back-end',
                  type: 'bignumber',
                  toFixedFallback: 6,
                },
                {
                  label: 'Onchain airdrop amount',
                  value: 'onchainInitAmount',
                  tag: 'On-chain',
                  type: 'bignumber',
                  toFixedFallback: 6,
                  responsive: true,
                },
                {
                  label: 'Backend airdrop amount',
                  value: 'backendInitAmount',
                  tag: 'Back-end',
                  type: 'bignumber',
                  toFixedFallback: 6,
                  responsive: true,
                },
              ]}
            />
          </div>
        </>
      )}
    </FoldableSection>
  )
}
