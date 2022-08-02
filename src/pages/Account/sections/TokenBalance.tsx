import FoldableSection from 'components/FordableSection'
import TableList from 'components/TableList'
import { MAX_AMOUNT_FIXED } from 'constants/asset'
import useAccountData from 'hooks/useAccountData'
import useAsset from 'hooks/useAsset'
import usePool from 'hooks/usePool'
import AccountDataAlertArea from 'pages/Account/components/AccountDataAlertArea'
import AssetLogoLabel from 'pages/components/AssetLogoLabel'
import { useMemo } from 'react'
import type { AlertStatus } from 'types/alert'
import { isTimeDiffFromNowMoreThan } from 'utils/time'

export default function TokenBalance({
  address,
  significantTimeGap,
  interval = 0,
}: {
  address?: string
  significantTimeGap: number
  interval?: number
}) {
  const { findAssetByDenom } = useAsset()
  const { getAssetTickers } = usePool()

  const { allBalanceTimestamp, allBalance, allBalanceLCD } = useAccountData({ address: address ?? '' })

  const balanceList = useMemo(() => {
    return allBalanceLCD.map((item) => {
      const onchainBalance = item.amount
      const backendBalance = allBalance.find((bal) => bal.denom === item.denom)?.amount
      const status: AlertStatus | undefined = backendBalance
        ? onchainBalance.isEqualTo(backendBalance)
          ? undefined
          : 'error'
        : 'error'

      const asset = findAssetByDenom(item.denom)
      const assetLabel = asset
        ? AssetLogoLabel({
            assets: getAssetTickers(asset),
            poolDenom: asset.isPoolToken ? item.denom : undefined,
          })
        : null
      const ticker = asset?.ticker
      const exponent = asset?.exponent ?? 0

      return {
        ...item,
        backendBalance,
        onchainBalance,
        status,
        assetLabel,
        ticker,
        exponent,
      }
    })
  }, [allBalance, allBalanceLCD, findAssetByDenom, getAssetTickers])

  // alert-inline data - balance
  const hasBalanceDiff = useMemo<boolean>(
    () => balanceList.findIndex((item) => item.status === 'error') > -1,
    [balanceList]
  )

  const isDelayed = useMemo<boolean>(
    () => isTimeDiffFromNowMoreThan(allBalanceTimestamp, significantTimeGap),
    [allBalanceTimestamp, significantTimeGap]
  )

  const allMatched = useMemo<boolean>(() => !hasBalanceDiff && !isDelayed, [hasBalanceDiff, isDelayed])

  return (
    <FoldableSection label="Token Balance" defaultIsOpen={true}>
      <AccountDataAlertArea
        isActive={balanceList.length > 0}
        significantTimeGap={significantTimeGap}
        isDataTimeDiff={isDelayed}
        isDataNotMatched={hasBalanceDiff}
        isAllDataMatched={allMatched}
      />

      <div className="mt-8">
        <TableList
          title="Balance by Token"
          showTitle={false}
          useSearch={false}
          showFieldsBar={true}
          list={balanceList}
          mergedFields={[['onchainBalance', 'backendBalance']]}
          mergedFieldLabels={['Balance']}
          defaultSortBy="onchainBalance"
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
              label: 'Denom',
              value: 'denom',
              abbrOver: 8,
              widthRatio: 20,
              responsive: true,
            },
            {
              label: 'Onchain Data',
              value: 'onchainBalance',
              tag: 'On-chain',
              type: 'bignumber',
              toFixedFallback: MAX_AMOUNT_FIXED,
            },
            {
              label: 'Backend Data',
              value: 'backendBalance',
              tag: 'Back-end',
              type: 'bignumber',
              toFixedFallback: MAX_AMOUNT_FIXED,
            },
          ]}
        />
      </div>
    </FoldableSection>
  )
}
