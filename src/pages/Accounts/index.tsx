import BigNumber from 'bignumber.js'
import AlertBox from 'components/AlertBox'
import AppPage from 'components/AppPage'
import SearchInput from 'components/Inputs/SearchInput'
import Sticker from 'components/Sticker'
import TableList from 'components/TableList'
import { toastError } from 'components/Toast/generator'
import { MAX_AMOUNT_FIXED } from 'constants/asset'
import { CHAINS_VALID_TIME_DIFF_MAP } from 'constants/chain'
import { useAllBalance } from 'data/useAPI'
import { useAllBalanceLCD, useLatestBlockLCD } from 'data/useLCD'
import useAccountData from 'hooks/useAccountData'
import useAsset from 'hooks/useAsset'
import useChain from 'hooks/useChain'
import usePair from 'hooks/usePair'
import { useAtom } from 'jotai'
import AssetTableLogoCell from 'pages/components/AssetTableLogoCell'
import { useEffect, useMemo, useState } from 'react'
import { chainIdAtomRef } from 'state/atoms'
import type { Balance, BalanceLCD } from 'types/account'
import type { AlertStatus } from 'types/alert'
import type { APIHookReturn, LCDHookReturn } from 'types/api'
import type { BlockLCD } from 'types/block'
import { isTestnet } from 'utils/chain'
import { isTimeDiffFromNowMoreThan } from 'utils/time'

// text constants
const ERROR_MSG_BACKEND_TIMESTAMP_DIFF = 'Back-end timestamp different'
const ERROR_MSG_DATA_DIFF = 'Data difference between on-chain and back-end'
const SUCCESS_MSG_ALL_DATA_MATCHED = 'All data matched & no significant delay in timestamp'
// const DUMMY_ADDRESS = 'cre1pc2xjkz28r9744a5d7u3ddqhsw3a9hrf7acccz'
const DUMMY_ADDRESS = 'cre1le890ld7v2hfsaq7cz5ws8zsdnpmhlysmz8sfc'

export default function Accounts() {
  // chain atoms
  const [chainIdAtom] = useAtom(chainIdAtomRef)
  const isOnTestnet = isTestnet(chainIdAtom)

  // address
  const [searchAddress, setSearchAddress] = useState(DUMMY_ADDRESS)
  const [address, setAddress] = useState<undefined | string>(undefined)
  const handleAddressSearch = () => setAddress(searchAddress)

  // assetinfo handler
  const { findAssetByDenom } = useAsset()

  // block
  const { findChainById } = useChain()
  const { data: latestBlockLCDData }: LCDHookReturn<BlockLCD> = useLatestBlockLCD({})

  const { backendBlockHeight, onchainBlockHeight } = useMemo(() => {
    const backendBlockHeightRaw = findChainById(chainIdAtom)?.live?.height
    const backendBlockHeight = backendBlockHeightRaw ? new BigNumber(backendBlockHeightRaw).toFormat() : 'NA'

    const onchainBlockHeightRaw = latestBlockLCDData?.block.header.height
    const onchainBlockHeight = onchainBlockHeightRaw ? new BigNumber(onchainBlockHeightRaw).toFormat() : 'NA'

    return { backendBlockHeight, onchainBlockHeight }
  }, [chainIdAtom, findChainById, latestBlockLCDData])

  // fetching balance
  const { data: allBalanceData, error: allBalanceDataError }: APIHookReturn<Balance> = useAllBalance({
    address: address ?? '',
    fetch: address !== undefined,
  })
  const { data: allBalanceLCDData, error: allBalanceLCDError }: LCDHookReturn<BalanceLCD> = useAllBalanceLCD({
    address: address ?? '',
    fetch: address !== undefined,
  })

  // toast
  useEffect(() => {
    if (allBalanceDataError) toastError(allBalanceDataError.msg)
    if (allBalanceLCDError) toastError(allBalanceLCDError.msg)
  }, [allBalanceDataError, allBalanceLCDError])

  // table data - balance
  const { getAssetTickers } = usePair()

  const { balanceTableList, hasBalanceDiff } = useMemo(() => {
    const balanceTableList =
      allBalanceData?.data.asset
        .filter((item) => findAssetByDenom(item.denom) !== undefined)
        .map((item) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const assetInfo = findAssetByDenom(item.denom)!
          const exponent = assetInfo.exponent

          const asset = AssetTableLogoCell({ assets: getAssetTickers(assetInfo) })
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

  // alert-inline data
  const significantTimeGap = useMemo(() => CHAINS_VALID_TIME_DIFF_MAP[chainIdAtom], [chainIdAtom])

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

  // table data - staked amount
  const { allStakedDataTimestamp, allStaked, totalFarmRewards, allStakedLCD, totalFarmRewardsLCD } = useAccountData(
    address ?? ''
  )

  // console.log('allStaked', allStaked)
  // console.log('allStakedLCD', allStakedLCD)

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
    <AppPage className="pt-[calc(2rem+3.25rem)]">
      {/* responsible behavior should be fixed in the future to be not following the isMobile, which is not responsive */}
      <div
        className="fixed left-0 right-0 z-50 w-full"
        style={{ top: `calc(2.5rem + (1rem * 2)${isOnTestnet ? ' + 1.5rem' : ''})` }}
      >
        <Sticker>
          <div className="flex justify-start items-center px-4 py-4 md:justify-end md:space-x-2 md:px-12">
            <span className="hidden TYPO-BODY-XS text-grayCRE-400 dark:text-grayCRE-300 !font-medium md:block">
              Current Address
            </span>
            <span className="TYPO-BODY-XS text-black dark:text-white !font-black !font-mono text-left">
              {address ?? 'No address yet'}
            </span>
          </div>
        </Sticker>
      </div>

      <div className="flex flex-col justify-start items-stretch space-y-12">
        <div className="space-y-4">
          <SearchInput
            placeholder="Address"
            keyword={searchAddress}
            onChange={setSearchAddress}
            onSearch={handleAddressSearch}
          />
          {/* constant noti */}
          <AlertBox
            msg={`Block height \non-chain ${onchainBlockHeight} \nback-end ${backendBlockHeight}`}
            status="info"
            isActive={true}
          />
        </div>

        <section>
          <header className="mb-4">
            <h3 className="flex justify-start items-center TYPO-H3 text-black text-left dark:text-white">
              Token Balance
            </h3>
          </header>

          <div
            className={`${
              balanceTableList.length > 0 ? 'block' : 'hidden opacity-0'
            } flex flex-col justify-start items-start mb-4 transition-opacity`}
          >
            {/* data error noti */}
            <div className="flex flex-col space-y-2 w-full mt-4">
              <AlertBox msg={ERROR_MSG_DATA_DIFF} status="error" isActive={hasBalanceDiff} />
              <AlertBox
                msg={`${ERROR_MSG_BACKEND_TIMESTAMP_DIFF} ≧ ${new BigNumber(significantTimeGap).toFormat(0)}ms`}
                status="error"
                isActive={isBalanceDataTimeDiff}
              />
              <AlertBox msg={SUCCESS_MSG_ALL_DATA_MATCHED} status="success" isActive={isBalanceDataAllMatched} />
            </div>
          </div>

          <TableList
            title="Balance by Token"
            showTitle={false}
            useSearch={false}
            list={balanceTableList}
            mergedFields={['backendBalance', 'onchainBalance']}
            showFieldsBar={false}
            showItemsVertically={true}
            fields={[
              {
                label: 'Token',
                value: 'asset',
                type: 'html',
                widthRatio: 10,
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
        </section>

        <section>
          Total rewards claimable : {totalFarmRewards.toFormat(6)}
          Total rewards claimable : {totalFarmRewardsLCD.toFormat(6)}
        </section>

        <section>
          <header className="mb-4">
            <h3 className="flex justify-start items-center TYPO-H3 text-black text-left dark:text-white">
              Farm Staked Amount
            </h3>
          </header>

          <div
            className={`${
              stakedTableList.length > 0 ? 'block' : 'hidden opacity-0'
            } flex flex-col justify-start items-start mb-4 transition-opacity`}
          >
            {/* data error noti */}
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
            list={stakedTableList}
            mergedFields={['onchainStakedAmount', 'stakedAmount', 'queuedAmount']}
            showFieldsBar={false}
            showItemsVertically={true}
            fields={[
              {
                label: 'Asset',
                value: 'asset',
                type: 'html',
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
        </section>
      </div>
    </AppPage>
  )
}
