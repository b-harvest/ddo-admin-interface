import BigNumber from 'bignumber.js'
import FoldableSection from 'components/FordableSection'
import TableList from 'components/TableList'
import { toastError } from 'components/Toast/generator'
import { MAX_AMOUNT_FIXED } from 'constants/asset'
import { useAllBalance } from 'data/useAPI'
import { useAllBalanceLCD } from 'data/useLCD'
import useAsset from 'hooks/useAsset'
import usePair from 'hooks/usePair'
import AccountDataAlertArea from 'pages/Accounts/components/AccountDataAlertArea'
import AssetTableLogoCell from 'pages/components/AssetTableLogoCell'
import { useEffect, useMemo } from 'react'
import type { Balance, BalanceLCD } from 'types/account'
import type { AlertStatus } from 'types/alert'
import type { APIHookReturn, LCDHookReturn } from 'types/api'
import { isTimeDiffFromNowMoreThan } from 'utils/time'

export default function TokenBalance({
  address,
  significantTimeGap,
  interval = 0,
}: {
  address: string | undefined
  significantTimeGap: number
  interval?: number
}) {
  const { findAssetByDenom } = useAsset()

  const { getAssetTickers, findPoolFromPairsByDenom } = usePair()

  // fetching balance
  const { data: allBalanceData, error: allBalanceDataError }: APIHookReturn<Balance> = useAllBalance(
    {
      address: address ?? '',
      fetch: address !== undefined,
    },
    interval
  )
  const { data: allBalanceLCDData, error: allBalanceLCDError }: LCDHookReturn<BalanceLCD> = useAllBalanceLCD(
    {
      address: address ?? '',
      fetch: address !== undefined,
    },
    interval
  )

  // toast
  useEffect(() => {
    if (allBalanceDataError) toastError(allBalanceDataError.msg)
    if (allBalanceLCDError) toastError(allBalanceLCDError.msg)
  }, [allBalanceDataError, allBalanceLCDError])

  const { balanceTableList, hasBalanceDiff } = useMemo(() => {
    const balanceTableList =
      allBalanceData?.data.asset
        .filter((item) => (findAssetByDenom(item.denom)?.isPoolToken ? findPoolFromPairsByDenom(item.denom) : true))
        .map((item) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const assetInfo = findAssetByDenom(item.denom)!
          const exponent = assetInfo.exponent

          const asset = AssetTableLogoCell({
            assets: getAssetTickers(assetInfo),
            poolDenom: assetInfo.isPoolToken ? item.denom : undefined,
          })
          const backendBalance = new BigNumber(item.amount).dividedBy(10 ** exponent)
          const onchainBalance = allBalanceLCDData
            ? new BigNumber(allBalanceLCDData.balances.find((bal) => bal.denom === item.denom)?.amount ?? 0).dividedBy(
                10 ** exponent
              )
            : new BigNumber(0)
          const status: AlertStatus | undefined = backendBalance.isEqualTo(onchainBalance) ? undefined : 'error'

          return {
            denom: item.denom,
            ticker: assetInfo.ticker,
            asset,
            exponent,
            backendBalance,
            onchainBalance,
            status,
          }
        }) ?? []

    const hasBalanceDiff = balanceTableList.findIndex((item) => item.status === 'error') > -1

    return { balanceTableList, hasBalanceDiff }
  }, [allBalanceData, allBalanceLCDData, findAssetByDenom, getAssetTickers])

  // alert-inline data - balance
  const { isBalanceDataTimeDiff, isBalanceDataAllMatched } = useMemo(() => {
    const backEndTimestamp = allBalanceData?.curTimestamp * 1000 ?? 0
    const isBalanceDataTimeDiff = isTimeDiffFromNowMoreThan(backEndTimestamp, significantTimeGap)
    const isBalanceDataAllMatched = !hasBalanceDiff && !isBalanceDataTimeDiff

    return {
      isBalanceDataTimeDiff,
      isBalanceDataAllMatched,
    }
  }, [allBalanceData, hasBalanceDiff, significantTimeGap])

  return (
    <FoldableSection label="Token Balance" defaultIsOpen={true}>
      <AccountDataAlertArea
        isActive={balanceTableList.length > 0}
        significantTimeGap={significantTimeGap}
        isDataTimeDiff={isBalanceDataTimeDiff}
        isDataNotMatched={hasBalanceDiff}
        isAllDataMatched={isBalanceDataAllMatched}
      />

      <div className="mt-8">
        <TableList
          title="Balance by Token"
          showTitle={false}
          useSearch={false}
          showFieldsBar={true}
          list={balanceTableList}
          mergedFields={['backendBalance', 'onchainBalance']}
          mergedFieldLabel="Balance"
          defaultSortBy="onchainBalance"
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
              label: 'Denom',
              value: 'denom',
              abbrOver: 8,
              widthRatio: 20,
              responsive: true,
            },
            {
              label: 'Backend Data',
              value: 'backendBalance',
              tag: 'Back-end',
              type: 'bignumber',
              toFixedFallback: MAX_AMOUNT_FIXED,
            },
            {
              label: 'Onchain Data',
              value: 'onchainBalance',
              tag: 'On-chain',
              type: 'bignumber',
              toFixedFallback: MAX_AMOUNT_FIXED,
            },
          ]}
        />
      </div>
    </FoldableSection>
  )
}
