import BigNumber from 'bignumber.js'
import AppPage from 'components/AppPage'
import SearchInput from 'components/Inputs/SearchInput'
import NotiLine from 'components/NotiLine'
import Sticker from 'components/Sticker'
import TableList from 'components/TableList'
import { MAX_AMOUNT_FIXED } from 'constants/asset'
import { CHAINS_VALID_TIME_DIFF_MAP } from 'constants/chain'
import { useAllBalance } from 'data/useAPI'
import { useAllBalanceLCD, useLatestBlockLCD } from 'data/useLCD'
import useAsset from 'hooks/useAsset'
import useChain from 'hooks/useChain'
import { useAtom } from 'jotai'
import AssetTableCell from 'pages/components/AssetTableCell'
import { useMemo, useState } from 'react'
import { chainIdAtomRef, isTestnetAtomRef } from 'state/atoms'
import type { Balance, BalanceLCD } from 'types/account'
import type { APIHookReturn, LCDHookReturn } from 'types/api'
import type { BlockLCD } from 'types/block'
import type { STATUS } from 'types/status'
import { isTimeDiffFromNowMoreThan } from 'utils/time'

export default function Accounts() {
  // text constants
  const ERROR_MSG_BALANCE_DIFF = 'Balance difference between on-chain and back-end'
  const ERROR_MSG_BACKEND_TIMESTAMP_DIFF = 'Back-end timestamp different'
  const SUCCESS_MSG_ALL_DATA_MATCHED = 'All data matched, no significant difference'
  const DUMMY_ADDRESS = 'cre1pc2xjkz28r9744a5d7u3ddqhsw3a9hrf7acccz'

  // chain atoms
  const [chainIdAtom] = useAtom(chainIdAtomRef)
  const [isTestnetAtom] = useAtom(isTestnetAtomRef)

  // address
  const [searchAddress, setSearchAddress] = useState(DUMMY_ADDRESS)
  const [address, setAddress] = useState<undefined | string>(undefined)

  // assetinfo handler
  const { findAssetByDenom } = useAsset()

  // chain info
  const { findChainById } = useChain()
  const backendBlock = useMemo(() => findChainById(chainIdAtom), [chainIdAtom, findChainById])

  // fetching balance → refactor needed for auto update by swr interval ?
  const { data: allBalanceData }: APIHookReturn<Balance> = useAllBalance(address ?? 'x')
  console.log('useAllBalance', allBalanceData)

  const { data: allBalanceLCDData, error: allBalanceLCDError }: LCDHookReturn<BalanceLCD> = useAllBalanceLCD(
    address ?? 'x'
  )
  const { data: latestBlockLCDData, error: latestBlockLCDError }: LCDHookReturn<BlockLCD> = useLatestBlockLCD()
  console.log('latestBlockLCDData', latestBlockLCDData, latestBlockLCDError)

  // table data
  const { balanceTableList, hasBalanceDiff } = useMemo(() => {
    const balanceTableList = allBalanceData.data.asset
      .filter((item) => findAssetByDenom(item.denom) !== null)
      .map((item) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const assetInfo = findAssetByDenom(item.denom)!
        const logoUrl = assetInfo.logoUrl
        const ticker = assetInfo.ticker
        const exponent = assetInfo.exponent

        const asset = AssetTableCell({ logoUrl, ticker })
        const backendBalance = new BigNumber(item.amount).dividedBy(10 ** exponent)
        const onchainBalance = allBalanceLCDData
          ? new BigNumber(allBalanceLCDData.balances.find((bal) => bal.denom === item.denom)?.amount ?? 0).dividedBy(
              10 ** exponent
            )
          : new BigNumber(0)
        const status: STATUS | undefined = backendBalance.isEqualTo(onchainBalance) ? undefined : 'error'

        return {
          denom: item.denom,
          exponent,
          asset,
          backendBalance,
          onchainBalance,
          status,
        }
      })

    const hasBalanceDiff = balanceTableList.findIndex((item) => item.status === 'error') > -1

    return { balanceTableList, hasBalanceDiff }
  }, [allBalanceData, allBalanceLCDData, findAssetByDenom])

  // notiline data
  const { significantTimeGap, isTimeDiff, isAllDataMatched } = useMemo(() => {
    const backEndTimestamp = allBalanceData.curTimestamp * 1000
    const significantTimeGap = CHAINS_VALID_TIME_DIFF_MAP[chainIdAtom]
    const isTimeDiff = isTimeDiffFromNowMoreThan(backEndTimestamp, significantTimeGap)

    const isAllDataMatched = !hasBalanceDiff && !isTimeDiff
    return {
      significantTimeGap,
      isTimeDiff,
      isAllDataMatched,
    }
  }, [allBalanceData, chainIdAtom, hasBalanceDiff])

  const fetchBalance = () => {
    console.log('fetchBalance')
    setAddress(searchAddress)
  }

  return (
    <AppPage className="pt-[calc(2rem+3.25rem)]">
      {/* responsible behavior should be fixed in the future to be not following the isMobile, which is not responsive */}
      <div
        className="fixed left-0 right-0 z-50 w-full"
        style={{ top: `calc(2.5rem + (1rem * 2)${isTestnetAtom ? ' + 1.5rem' : ''})` }}
      >
        <Sticker>
          <div className="flex justify-start items-center px-4 py-4 md:justify-end md:space-x-2 md:px-12">
            <span className="hidden TYPO-BODY-XS text-grayCRE-400 !font-medium md:block">Current Address</span>
            <span className="TYPO-BODY-XS !font-black text-left">{address ?? 'No address yet'}</span>
          </div>
        </Sticker>
      </div>

      <div className="flex flex-col justify-start items-stretch space-y-8">
        <SearchInput
          placeholder="Address"
          keyword={searchAddress}
          onChange={setSearchAddress}
          onSearch={fetchBalance}
        />

        <section>
          <header className="mb-4">
            <h3 className="flex justify-start items-center TYPO-H3 text-black text-left">All Balance</h3>
          </header>

          <div
            className={`${
              balanceTableList.length > 0 ? 'block' : 'hidden opacity-0'
            } flex flex-col justify-start items-start mb-4 transition-opacity`}
          >
            {/* constant noti */}
            <NotiLine
              msg={`On-chain block height: ${latestBlockLCDData.block.header.height}`}
              color="info"
              isActive={true}
            />
            <NotiLine
              msg={`Back-end block height: ${backendBlock?.live?.height ?? 'NA'}`}
              color="info"
              isActive={true}
            />

            {/* data error noti */}
            <NotiLine msg={ERROR_MSG_BALANCE_DIFF} color="error" isActive={hasBalanceDiff} />
            <NotiLine
              msg={`${ERROR_MSG_BACKEND_TIMESTAMP_DIFF} ≧ ${new BigNumber(significantTimeGap).toFormat(0)}ms`}
              color="error"
              isActive={isTimeDiff}
            />
            <NotiLine msg={SUCCESS_MSG_ALL_DATA_MATCHED} color="success" isActive={isAllDataMatched} />
          </div>

          <TableList
            title="All Balance"
            showTitle={false}
            useSearch={false}
            list={balanceTableList}
            mergedFields={['backendBalance', 'onchainBalance']}
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
      </div>
    </AppPage>
  )
}
