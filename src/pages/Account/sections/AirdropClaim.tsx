import BigNumber from 'bignumber.js'
import FoldableSection from 'components/FordableSection'
import TableList from 'components/TableList'
import useAccountData from 'hooks/useAccountData'
import useAsset from 'hooks/useAsset'
import usePair from 'hooks/usePair'
// import usePool from 'hooks/usePool'
import AccountDataAlertArea from 'pages/Account/components/AccountDataAlertArea'
import AssetTableLogoCell from 'pages/components/AssetTableLogoCell'
import { useMemo } from 'react'
import type { AlertStatus } from 'types/alert'
import { isTimeDiffFromNowMoreThan } from 'utils/time'

export default function AirdropClaim({
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

  const { airdropClaimDataTimestamp, airdropClaim, airdropClaimLCD } = useAccountData({
    address: address ?? '',
    interval,
  })

  const airdropList = useMemo<any[]>(() => {
    return (
      airdropClaimLCD?.initial_claimable_coins.map((item) => {
        const onchainInitAmount = item.amount
        const backendInitAmount = airdropClaim
          ? airdropClaim.initialClaimableCoins.find((air) => air.denom === item.denom)?.amount ?? new BigNumber(0)
          : undefined
        const onchainClaimableAmount = airdropClaimLCD
          ? airdropClaimLCD.claimable_coins.find((air) => air.denom === item.denom)?.amount ?? new BigNumber(0)
          : undefined
        const backendClaimableAmount = airdropClaim
          ? airdropClaim.claimableCoins.find((air) => air.denom === item.denom)?.amount ?? new BigNumber(0)
          : undefined
        const status: AlertStatus | undefined =
          backendInitAmount && onchainInitAmount.isEqualTo(backendInitAmount) ? undefined : 'error'

        const asset = findAssetByDenom(item.denom)
        const assetLabel = asset
          ? AssetTableLogoCell({
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
          airdropId: airdropClaimLCD.airdrop_id,
        }
      }) ?? []
    )
  }, [airdropClaim, airdropClaimLCD, findAssetByDenom, getAssetTickers])

  const hasDiff = useMemo<boolean>(() => airdropList.findIndex((item) => item.status === 'error') > -1, [airdropList])

  // alert-inline data - AirdropClaim amount
  const isDelayed = useMemo<boolean>(
    () => isTimeDiffFromNowMoreThan(airdropClaimDataTimestamp, significantTimeGap),
    [airdropClaimDataTimestamp, significantTimeGap]
  )

  const allMatched = useMemo<boolean>(() => !hasDiff && !isDelayed, [hasDiff, isDelayed])

  return (
    <FoldableSection label="Airdrop" defaultIsOpen={true}>
      <AccountDataAlertArea
        isActive={airdropList.length > 0}
        significantTimeGap={significantTimeGap}
        isDataTimeDiff={isDelayed}
        isDataNotMatched={hasDiff}
        isAllDataMatched={allMatched}
      />

      <div className="mt-8">
        <TableList
          title={`Airdrop ${airdropClaim?.AirdropId ?? ''}`}
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
    </FoldableSection>
  )
}
