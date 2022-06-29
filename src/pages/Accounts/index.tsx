import SearchInput from 'components/Inputs/SearchInput'
import Sticker from 'components/Sticker'
import TableList from 'components/TableList'
import { useAllBalance } from 'hooks/useAPI'
import { useState } from 'react'
import type { Balance } from 'types/account'
import type { APIHookReturn } from 'types/api'

export default function Accounts() {
  const DUMMY_ADDRESS = 'cre1pc2xjkz28r9744a5d7u3ddqhsw3a9hrf7acccz'

  const [searchAddress, setSearchAddress] = useState(DUMMY_ADDRESS)
  const [address, setAddress] = useState<undefined | string>(undefined)

  const {
    data: allBalanceData,
    isError: allBalanceIsError,
    isLoading: allBalanceIsLoading,
  }: APIHookReturn<Balance> = useAllBalance(address ?? 'x')
  console.log('useAllBalance', allBalanceData)

  const fetchBalance = () => {
    console.log('fetchBalance')
    setAddress(searchAddress)
  }

  const balanceList = allBalanceData.data.asset.map((item) => {
    return {
      denom: item.denom,
      web2Balance: item.amount,
      web3Balance: 'WIP',
    }
  })

  return (
    <div className="flex flex-col justify-start items-stretch space-y-8">
      {/* address sticker */}
      <div className="fixed top-[calc((1rem*2)+2.25rem)] right-0 z-50 w-full md:top-[calc((1rem*2)+2.25rem+2rem)] md:right-[2rem] md:w-fit">
        <Sticker>
          <div className="flex justify-start items-center space-x-2 p-4">
            <span className="hidden TYPO-BODY-XS text-grayCRE-400 !font-medium md:block">Current Address</span>
            <span className="TYPO-BODY-XS !font-black text-left">{address ?? 'No address yet'}</span>
          </div>
        </Sticker>
      </div>

      {/* page title */}
      <h2 className="TYPO-H2 text-black text-left pt-[2rem]">계정 확인</h2>

      <SearchInput placeholder="Address" keyword={searchAddress} onChange={setSearchAddress} onSearch={fetchBalance} />

      <section>
        <TableList
          title={`All Balance`}
          useSearch={false}
          list={balanceList}
          fields={[
            {
              label: 'Denom',
              value: 'denom',
              // widthRatio: 60,
            },
            {
              label: 'Web2 Data',
              value: 'web2Balance',
            },
            {
              label: 'Chain Data',
              value: 'web3Balance',
            },
          ]}
        />
      </section>
    </div>
  )
}
