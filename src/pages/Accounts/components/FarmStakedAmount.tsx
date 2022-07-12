import BigNumber from 'bignumber.js'
import AlertBox from 'components/AlertBox'
import FoldableSection from 'components/FordableSection'
import TableList from 'components/TableList'
import { ERROR_MSG_BACKEND_TIMESTAMP_DIFF, ERROR_MSG_DATA_DIFF, SUCCESS_MSG_ALL_DATA_MATCHED } from 'constants/msg'
import useAccountData from 'hooks/useAccountData'
import useAsset from 'hooks/useAsset'
import usePair from 'hooks/usePair'
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

  const { allStakedDataTimestamp, allStaked, allStakedLCD, allFarmRewards, allFarmRewardsLCD } = useAccountData(
    address ?? ''
  )

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
      <div
        className={`${
          stakedTableList.length > 0 ? 'block' : 'hidden opacity-0'
        } flex flex-col justify-start items-start mb-4 transition-opacity`}
      >
        <div className="flex flex-col space-y-2 w-full mt-4">
          <AlertBox msg={ERROR_MSG_DATA_DIFF} status="error" isActive={hasStakedDiff} />
          <AlertBox
            msg={`${ERROR_MSG_BACKEND_TIMESTAMP_DIFF} ≧ ${new BigNumber(significantTimeGap).toFormat(0)}ms`}
            status="error"
            isActive={isStakedDataTimeDiff}
          />
          <AlertBox msg={SUCCESS_MSG_ALL_DATA_MATCHED} status="success" isActive={isStakedDataAllMatched} />
        </div>
      </div>

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
    </FoldableSection>
  )
}
