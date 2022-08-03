import H3 from 'components/H3'
import SelectTab from 'components/SelectTab'
import TimestampMemo from 'components/TimestampMemo'
import useAccounts from 'hooks/useAccounts'
import usePages from 'pages/hooks/usePages'
import { useEffect, useMemo, useState } from 'react'
import type { RankData } from 'types/accounts'

import Ranks from './../components/Ranks'

export enum RankType {
  FarmStaking = 'farming',
  Balance = 'balance',
  Total = 'total',
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
  // route data
  const { history, searchMap } = usePages()

  const searchRankType = useMemo<RankType | undefined>(() => {
    const search = searchMap?.get('rank')
    const i = search ? (Object.values(RankType) as string[]).indexOf(search) : -1
    const key = Object.keys(RankType)[i]
    return RankType[key]
  }, [searchMap])

  // rank type
  const [rankType, setRankType] = useState<RankType>(searchRankType ?? RankType.Total)
  const handleRankTypeSelect = (value: RankType) => {
    history.push(`/accounts?rank=${value}`)
    setRankType(value)
  }

  useEffect(() => {
    if (searchRankType) setRankType(searchRankType)
  }, [searchRankType])

  // fetch data
  const { farmRanks, farmRanksTimestamp, balanceRanks, balanceRanksTimestamp, totalRanks, totalRanksTimestamp } =
    useAccounts()

  const farmRanksTime = useMemo(() => <TimestampMemo timestamp={farmRanksTimestamp} />, [farmRanksTimestamp])
  const balanceRanksTime = useMemo(() => <TimestampMemo timestamp={balanceRanksTimestamp} />, [balanceRanksTimestamp])
  const totalRanksTime = useMemo(() => <TimestampMemo timestamp={totalRanksTimestamp} />, [totalRanksTimestamp])

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

// export function TimestampMemo(memo: string) {
//   return (
//     <div className="flex items-center space-x-2 TYPO-BODY-XS !font-medium">
//       <div>Last synced</div> <div className="">{memo}</div>
//     </div>
//   )
// }

// export function TimestampMemo(timestamp: number | undefined) {
//   return TimestampMemo(timestamp ? `${dayjs(timestamp).format(TIMESTAMP_FORMAT)}` : '-')
// }
