import BigNumber from 'bignumber.js'
import FoldableSection from 'components/FordableSection'
import TableList from 'components/TableList'
import dayjs from 'dayjs'
import useAccountData from 'hooks/useAccountData'
import useAsset from 'hooks/useAsset'
import usePair from 'hooks/usePair'
// import usePool from 'hooks/usePool'
import AccountDataAlertArea from 'pages/Accounts/components/AccountDataAlertArea'
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
  // const { findPoolByDenom } = usePool()

  const { airdropClaimDataTimestamp, airdropClaim, airdropClaimLCD } = useAccountData({
    address: address ?? '',
    interval,
  })

  const { airdropClaimTableList, hasDiff } = useMemo(() => {
    const onchainClaimableMap =
      airdropClaimLCD?.initial_claimable_coins.reduce((accm, item) => ({ ...accm, [item.denom]: item }), {}) ?? {}

    const claimableCoinsMap =
      airdropClaim?.claimableCoins.reduce((accm, item) => ({ ...accm, [item.denom]: item }), {}) ?? {}

    const airdropClaimTableList =
      airdropClaim?.initialClaimableCoins
        .filter((item) => findAssetByDenom(item.denom) !== undefined)
        .map((item) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const assetInfo = findAssetByDenom(item.denom)!
          const asset = AssetTableLogoCell({
            assets: getAssetTickers(assetInfo),
            poolDenom: item.denom,
            isSingleAssetAutoSpaced: true,
          })

          const claimableAmount: BigNumber = claimableCoinsMap[item.denom]?.amount ?? new BigNumber(0)
          const onchainClaimableAmount: BigNumber = onchainClaimableMap[item.denom]?.amount ?? new BigNumber(0)
          const status: AlertStatus | undefined = item.amount.isEqualTo(onchainClaimableAmount) ? undefined : 'error'

          return {
            ...item,
            asset,
            airdropId: airdropClaim?.AirdropId ?? '',
            timestamp: dayjs(airdropClaim.timestamp / 1000).format('YYYY MMM DD, H : m : s'),
            claimableAmount,
            onchainClaimableAmount,
            status,
          }
        }) ?? []

    const hasDiff = airdropClaimTableList.findIndex((item) => item.status === 'error') > -1

    return { airdropClaimTableList, hasDiff }
  }, [airdropClaim, airdropClaimLCD, findAssetByDenom, getAssetTickers])

  // alert-inline data - AirdropClaim amount
  const { isAirdropClaimDataTimeDiff, isAirdropClaimDataAllMatched } = useMemo(() => {
    const isAirdropClaimDataTimeDiff = isTimeDiffFromNowMoreThan(airdropClaimDataTimestamp, significantTimeGap)
    const isAirdropClaimDataAllMatched = !hasDiff && !isAirdropClaimDataTimeDiff

    return {
      isAirdropClaimDataTimeDiff,
      isAirdropClaimDataAllMatched,
    }
  }, [airdropClaimDataTimestamp, hasDiff, significantTimeGap])

  return (
    <FoldableSection label="Airdrop Claimable" defaultIsOpen={true}>
      <AccountDataAlertArea
        isActive={airdropClaimTableList.length > 0}
        significantTimeGap={significantTimeGap}
        isDataTimeDiff={isAirdropClaimDataTimeDiff}
        isDataNotMatched={hasDiff}
        isAllDataMatched={isAirdropClaimDataAllMatched}
      />

      <div className="mt-8">
        <TableList
          title={`Airdrop ${airdropClaim?.AirdropId ?? ''}`}
          showTitle={false}
          useSearch={false}
          showFieldsBar={true}
          list={airdropClaimTableList}
          mergedFields={['amount', 'onchainClaimableAmount']}
          mergedFieldLabel="Initial airdrop amount"
          defaultSortBy="onchainClaimableAmount"
          defaultIsSortASC={false}
          nowrap={false}
          fields={[
            {
              label: 'Token',
              value: 'asset',
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
              label: 'Time',
              value: 'timestamp',
              widthRatio: 20,
              responsive: true,
            },
            {
              label: 'Claimable amount',
              value: 'claimableAmount',
              tag: 'Back-end',
              type: 'bignumber',
              toFixedFallback: 6,
              responsive: true,
            },
            {
              label: 'Backend amount',
              value: 'amount',
              tag: 'Back-end',
              type: 'bignumber',
              toFixedFallback: 6,
            },
            {
              label: 'Onchain amount',
              value: 'onchainClaimableAmount',
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
