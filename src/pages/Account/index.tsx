import AppPage from 'components/AppPage'
import ExplorerLink from 'components/ExplorerLink'
// import BlockHeightPolling from 'components/BlockHeightPolling'
import SearchInput from 'components/Inputs/SearchInput'
import Sticker from 'components/Sticker'
import { DUMMY_ADDRESS } from 'constants/msg'
// import useChain from 'hooks/useChain'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { chainIdAtomRef } from 'state/atoms'
import { isTestnet } from 'utils/chain'

import AccountData from './sections/AccountData'
export default function Accounts() {
  const { id }: { id?: string } = useParams()

  // chainId atom
  const [chainIdAtom] = useAtom(chainIdAtomRef)

  // address
  const [inputAddr, setInputAddr] = useState(DUMMY_ADDRESS)
  const [addr, setAddr] = useState<undefined | string>(undefined)

  const history = useHistory()
  const onSearch = () => {
    if (inputAddr.length) {
      setAddr(inputAddr)
      history.push(`/account/${inputAddr}`)
    }
  }

  useEffect(() => {
    if (id) {
      setInputAddr(id)
      setAddr(id)
    }
  }, [id, setInputAddr, setAddr])

  return (
    <AppPage className="pt-[calc(1.5rem+3.25rem)]">
      <div
        className={`fixed left-0 right-0 z-50 w-full translate-y-[28px] md:translate-y-0`}
        style={{ top: `calc(2.5rem + (1rem * 2)${isTestnet(chainIdAtom) ? ' + 1.5rem' : ''})` }}
      >
        <Sticker>
          <div className="flex justify-start items-center px-4 py-3 md:justify-start md:space-x-2 md:px-12">
            <span className="hidden TYPO-BODY-XS text-grayCRE-400 dark:text-grayCRE-300 !font-medium md:block">
              Current Address
            </span>
            <span className="TYPO-BODY-XS text-black dark:text-white !font-black FONT-MONO text-left">
              {addr ?? 'No address yet'}
            </span>
          </div>
        </Sticker>
      </div>

      <div className="flex flex-col justify-start items-stretch space-y-4 mb-20">
        <SearchInput placeholder="Address" keyword={inputAddr} onChange={setInputAddr} onSearch={onSearch} />
        {addr ? (
          <div className="flex justify-end">
            <ExplorerLink address={addr} />
          </div>
        ) : null}
      </div>

      <AccountData address={addr ?? ''} />
    </AppPage>
  )
}
