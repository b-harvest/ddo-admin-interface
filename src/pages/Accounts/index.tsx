import AppPage from 'components/AppPage'
import Hr from 'components/Hr'
import dayjs from 'dayjs'
import useAccounts from 'hooks/useAccounts'
import { useMemo } from 'react'

import Ranks from './components/Ranks'

const TIMESTAMP_FORMAT = 'YYYY MMM DD, HH:mm:ss'

export default function Accounts() {
  const { farmRanks, farmRanksTimestamp, balanceRanks, balanceRanksTimestamp, totalRanks, totalRanksTimestamp } =
    useAccounts()

  const farmRanksTime = useMemo(() => getTimeMemo(farmRanksTimestamp), [farmRanksTimestamp])
  const balanceRanksTime = useMemo(() => getTimeMemo(balanceRanksTimestamp), [balanceRanksTimestamp])
  const totalRanksTime = useMemo(() => getTimeMemo(totalRanksTimestamp), [totalRanksTimestamp])

  return (
    <AppPage>
      <div className="mb-20"></div>

      <div className="flex flex-col justify-start items-stretch space-y-12">
        <Ranks
          title={`Farm Staking Top ${farmRanks.length ? farmRanks.length : ''}`}
          ranks={farmRanks}
          memo={farmRanksTime}
          amountLabel="Farm staked amount"
        />
        <Hr />
        <Ranks
          title={`Balance Top ${balanceRanks.length ? balanceRanks.length : ''}`}
          ranks={balanceRanks}
          memo={balanceRanksTime}
          amountLabel="Balance"
        />
        <Hr />
        <Ranks
          title={`Farm + Balance Top ${totalRanks.length ? totalRanks.length : ''}`}
          ranks={totalRanks}
          memo={totalRanksTime}
          amountLabel="Balance"
        />
      </div>
    </AppPage>
  )
}

function AccountsRankTableMemo(memo: string) {
  return (
    <div className="flex items-center space-x-2 TYPO-BODY-XS !font-medium">
      <div>Last synced</div> <div className="">{memo}</div>
    </div>
  )
}

function getTimeMemo(timestamp: number | undefined) {
  return AccountsRankTableMemo(timestamp ? `${dayjs(timestamp).format(TIMESTAMP_FORMAT)}` : '-')
}
