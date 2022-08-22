import H3 from 'components/H3'
import SelectTab from 'components/SelectTab'
import TimestampMemo from 'components/TimestampMemo'
import useAccounts from 'hooks/useAccounts'
import usePages from 'pages/hooks/usePages'
import { useEffect, useMemo, useState } from 'react'
import type { RankData } from 'types/accounts'
import { firstCharToUpperCase } from 'utils/text'

import Ranks from './../components/Ranks'

export default function TopAccounts() {
  // fetch data
  const { rankTypes, getRanks, isLoading } = useAccounts()

  // rank tab selectors
  const rankTypeTabItems = useMemo<{ label: string; value: string }[]>(
    () => rankTypes.map((item) => ({ label: firstCharToUpperCase(item), value: item })),
    [rankTypes]
  )

  // selected rank type
  const [rankType, setRankType] = useState<string>(rankTypes[0] ?? 'total')
  const handleRankTypeSelect = (value: string) => {
    history.push(`/accounts?rank=${value}`)
    setRankType(value)
  }

  // route data
  const { history, searchMap } = usePages()
  const searchRankType = useMemo<string | undefined>(() => {
    const search = searchMap?.get('rank')
    return search && rankTypes.includes(search) ? search : undefined
  }, [searchMap, rankTypes])

  useEffect(() => {
    if (searchRankType) setRankType(searchRankType)
  }, [searchRankType])

  const { ranks, ranksTime, amountLabel } = useMemo<{
    ranks: RankData[]
    ranksTime: JSX.Element
    amountLabel: string
  }>(() => {
    const { ranks, timestamp } = getRanks(rankType)
    let amountLabel: string

    switch (rankType) {
      case 'farming':
        amountLabel = 'Farm staked amount'
        break
      case 'balance':
        amountLabel = 'Balance'
        break
      case 'module':
        amountLabel = 'Module balance'
        break
      case 'total':
        amountLabel = 'Farm staked + balance'
        break
      default:
        amountLabel = ''
    }

    return {
      ranks,
      ranksTime: <TimestampMemo timestamp={timestamp} />,
      amountLabel,
    }
  }, [getRanks, rankType])

  // loader
  const [showLoader, setShowLoader] = useState<boolean>(true)
  useEffect(() => {
    setShowLoader(isLoading)
  }, [isLoading])

  return (
    <>
      <div className="flex justify-between items-center space-x-4 mb-4">
        <H3 title={`Top ${ranks.length ? ranks.length : ''}`} />
        <div className="grow shrink md:grow-0 md:shrink-0">
          <SelectTab<string>
            tabItems={rankTypeTabItems}
            selectedValue={rankType}
            onChange={handleRankTypeSelect}
            className="!TYPO-BODY-S"
          />
        </div>
      </div>

      <Ranks
        isLoading={showLoader}
        title={`${rankType} Top ${ranks.length ? ranks.length : ''}`}
        ranks={ranks}
        memo={ranksTime}
        amountLabel={amountLabel}
      />
    </>
  )
}
