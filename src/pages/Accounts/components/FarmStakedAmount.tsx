import BigNumber from 'bignumber.js'
import FoldableSection from 'components/FordableSection'
import TableList from 'components/TableList'
import useAccountData from 'hooks/useAccountData'
import useAsset from 'hooks/useAsset'
import usePair from 'hooks/usePair'
import AccountDataAlertArea from 'pages/Accounts/components/AccountDataAlertArea'
import AssetTableLogoCell from 'pages/components/AssetTableLogoCell'
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
  const { getAssetTickers } = usePair()

  const { allStakedDataTimestamp, allStaked, allStakedLCD } = useAccountData(address ?? '')

  const { stakedTableList, hasStakedDiff } = useMemo(() => {
    const onchainStakedMap = allStakedLCD
      .filter((item) => item.starting_epoch === '4' || item.starting_epoch === undefined) // ?
      .reduce((accm, item) => ({ ...accm, [item.denom]: item }), {})

    const stakedTableList = allStaked
      .filter((item) => findAssetByDenom(item.denom) !== undefined)
      .map((item) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const assetInfo = findAssetByDenom(item.denom)!
        const asset = AssetTableLogoCell({ assets: getAssetTickers(assetInfo) })
        const onchainStakedAmount = onchainStakedMap[item.denom]?.amount ?? new BigNumber(0)
        const status: AlertStatus | undefined = item.stakedAmount.isEqualTo(onchainStakedAmount) ? undefined : 'error'

        return {
          asset,
          ...item,
          onchainStakedAmount,
          status,
        }
      })

    const hasStakedDiff = stakedTableList.findIndex((item) => item.status === 'error') > -1

    return { stakedTableList, hasStakedDiff }
  }, [allStaked, allStakedLCD, findAssetByDenom, getAssetTickers])

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
    <FoldableSection label="Farm Staked Amount" defaultIsOpen={false}>
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
          mergedFields={['onchainStakedAmount', 'stakedAmount', 'queuedAmount']}
          mergedFieldLabel="Staked Amount"
          defaultSortBy="onchainStakedAmount"
          defaultIsSortASC={false}
          showItemsVertically={false}
          fields={[
            {
              label: 'Pool',
              value: 'asset',
              type: 'html',
              widthRatio: 30,
            },
            {
              label: 'Denom',
              value: 'denom',
              widthRatio: 10,
            },
            {
              label: 'Onchain Amount',
              value: 'onchainStakedAmount',
              tag: 'On-chain',
              type: 'bignumber',
              toFixedFallback: 6,
            },
            {
              label: 'Backend Amount',
              value: 'stakedAmount',
              tag: 'Back-end',
              type: 'bignumber',
              toFixedFallback: 6,
            },
            {
              label: 'Backend Queued Amount',
              value: 'queuedAmount',
              tag: '* Queued',
              type: 'bignumber',
              toFixedFallback: 6,
            },
          ]}
        />
      </div>
    </FoldableSection>
  )
}
