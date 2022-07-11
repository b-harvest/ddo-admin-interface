import BigNumber from 'bignumber.js'
import AppPage from 'components/AppPage'
import SearchInput from 'components/Inputs/SearchInput'
import NotiLine from 'components/NotiLine'
import Sticker from 'components/Sticker'
import TableList from 'components/TableList'
import { MAX_AMOUNT_FIXED } from 'constants/asset'
import { CHAINS_VALID_TIME_DIFF_MAP } from 'constants/chain'
import { useAllBalance } from 'hooks/useAPI'
import useAsset from 'hooks/useAsset'
import { useAtom } from 'jotai'
import { useState } from 'react'
import { chainIdAtomRef, isTestnetAtomRef } from 'state/atoms'
import type { Balance } from 'types/account'
import type { APIHookReturn } from 'types/api'
import type { STATUS } from 'types/status'
import { isTimeDiffFromNowMoreThan } from 'utils/time'
import { isMobile } from 'utils/userAgent'
export default function Accounts() {
  // text constants
  const ERROR_MSG_BALANCE_DIFF = 'Balance difference between back-end/on-chain data'
  const ERROR_MSG_BACKEND_TIMESTAMP_DIFF = 'Back-end timestamp different'
  const SUCCESS_MSG_ALL_DATA_MATCHED = 'All data matched, no significant difference'
  const DUMMY_ADDRESS = 'cre1pc2xjkz28r9744a5d7u3ddqhsw3a9hrf7acccz'

  // css by isTestnet
  const [chainIdAtom] = useAtom(chainIdAtomRef)
  const [isTestnetAtom] = useAtom(isTestnetAtomRef)

  // address
  const [searchAddress, setSearchAddress] = useState(DUMMY_ADDRESS)
  const [address, setAddress] = useState<undefined | string>(undefined)

  // assetinfo handler
  const { findAssetInfoByDenom } = useAsset()

  // fetching balance → should be refactored to atom
  const { data: allBalanceData }: APIHookReturn<Balance> = useAllBalance(address ?? 'x')
  console.log('useAllBalance', allBalanceData)

  const fetchBalance = () => {
    console.log('fetchBalance')
    setAddress(searchAddress)
  }

  // notiline data
  const backEndTimestamp = allBalanceData.curTimestamp * 1000
  const significantTimeGap = CHAINS_VALID_TIME_DIFF_MAP[chainIdAtom]
  const isTimeDiff = isTimeDiffFromNowMoreThan(backEndTimestamp, significantTimeGap)

  // table data
  const balanceTableList = allBalanceData.data.asset
    .filter((item) => findAssetInfoByDenom(item.denom) !== null)
    .map((item) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const assetInfo = findAssetInfoByDenom(item.denom)!
      const logoUrl = assetInfo.logoUrl
      const ticker = assetInfo.ticker
      const exponent = assetInfo.exponent

      const asset = getAssetTableCell({ logoUrl, ticker })
      const backendBalance = new BigNumber(item.amount).dividedBy(10 ** exponent)
      const onchainBalance = new BigNumber('34000000000000000000').dividedBy(10 ** exponent)
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
  const isAllDataMatched = !hasBalanceDiff && !isTimeDiff

  return (
    <AppPage className="pt-[calc(2rem+3.25rem)]">
      {/* responsible behavior should be fixed in the future to be not following the isMobile, which is not responsive */}
      <div
        className="fixed right-0 z-50 w-full md:right-[3rem] md:w-fit"
        style={{ top: `calc(2.5rem + (1rem * 2)${isTestnetAtom ? (isMobile ? ' + 1.5rem' : ' + 5.5rem') : ''})` }}
      >
        <Sticker>
          <div className="flex justify-start items-center space-x-2 p-4">
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

function getAssetTableCell({ ticker, logoUrl }: { ticker: string; logoUrl: string }) {
  return (
    <div className="flex justify-start items-center" title={ticker}>
      {logoUrl.length > 0 ? (
        <img src={logoUrl} alt={ticker} style={{ width: '1.5rem', marginRight: '0.5rem' }}></img>
      ) : null}
      <span className="TYPO-BODY-XS !font-black">{ticker}</span>
    </div>
  )
}
