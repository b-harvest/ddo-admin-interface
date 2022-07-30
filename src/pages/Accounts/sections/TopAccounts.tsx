import H3 from 'components/H3'
import SelectTab from 'components/SelectTab'
import { TIMESTAMP_FORMAT } from 'constants/time'
import dayjs from 'dayjs'
import useAccounts from 'hooks/useAccounts'
import { useMemo, useState } from 'react'
import type { RankData } from 'types/accounts'

import Ranks from './../components/Ranks'

export enum RankType {
  FarmStaking = 'Farm Staking',
  Balance = 'Balance',
  Total = 'Farm Staking + Balance',
}

const TOP_ACCOUNTS_TYPE_TAB_ITEMS = [
  {
    label: 'Farming',
    value: RankType.FarmStaking,
  },
  {
    label: 'Balance',
    value: RankType.Balance,
  },
  {
    label: 'Total',
    value: RankType.Total,
  },
]

export default function TopAccounts() {
  const { farmRanks, farmRanksTimestamp, balanceRanks, balanceRanksTimestamp, totalRanks, totalRanksTimestamp } =
    useAccounts()

  const farmRanksTime = useMemo(() => getTimeMemo(farmRanksTimestamp), [farmRanksTimestamp])
  const balanceRanksTime = useMemo(() => getTimeMemo(balanceRanksTimestamp), [balanceRanksTimestamp])
  const totalRanksTime = useMemo(() => getTimeMemo(totalRanksTimestamp), [totalRanksTimestamp])

  const [rankType, setRankType] = useState<RankType>(RankType.Total)
  const handleRankTypeSelect = (value: RankType) => setRankType(value)

  const { ranks, ranksTime, amountLabel } = useMemo<{
    ranks: RankData[]
    ranksTime: JSX.Element
    amountLabel: string
  }>(() => {
    switch (rankType) {
      case RankType.FarmStaking:
        return { ranks: farmRanks, ranksTime: farmRanksTime, amountLabel: 'Farm staked amount' }
      case RankType.Balance:
        return { ranks: balanceRanks, ranksTime: balanceRanksTime, amountLabel: 'Balance' }
      case RankType.Total:
        return { ranks: totalRanks, ranksTime: totalRanksTime, amountLabel: 'Farm staked + balance' }
    }
  }, [farmRanks, farmRanksTime, balanceRanks, balanceRanksTime, totalRanks, totalRanksTime, rankType])

  return (
    <>
      <div className="flex justify-between items-center space-x-4 mb-4">
        <H3 title={`Top ${ranks.length ? ranks.length : ''}`} />
        <div className="grow shrink md:grow-0 md:shrink-0">
          <SelectTab<RankType>
            tabItems={TOP_ACCOUNTS_TYPE_TAB_ITEMS}
            selectedValue={rankType}
            onChange={handleRankTypeSelect}
            className="!TYPO-BODY-S"
          />
        </div>
      </div>

      <Ranks
        title={`${rankType} Top ${ranks.length ? ranks.length : ''}`}
        ranks={ranks}
        memo={ranksTime}
        amountLabel={amountLabel}
      />
    </>
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
