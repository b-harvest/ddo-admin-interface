import H3 from 'components/H3'
import SelectTab from 'components/SelectTab'
import TimestampMemo from 'components/TimestampMemo'
import useAccounts from 'hooks/vo/useAccounts'
import usePages from 'pages/hooks/usePages'
import { useEffect, useMemo, useState } from 'react'
import type { AccountsData } from 'types/vo/accounts'
import { firstCharToUpperCase } from 'utils/text'
import { CSVLink, CSVDownload } from "react-csv";

//import Ranks from '../components/Ranks'
import Lists from '../components/Lists'

export default function OperatingAccounts() {
  // fetch data
  const { rankTypes, getRanks, isLoading } = useAccounts()
  console.log('요이땅')
  console.log(rankTypes)
  //console.log(getRanks)
  //console.log(isLoading)

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

  const { ranks, ranksTime } = useMemo<{
    ranks: AccountsData[]
    ranksTime: JSX.Element
    //amountLabel: string
  }>(() => {
    const { ranks, timestamp } = getRanks(rankType)
    return {
      ranks,
      ranksTime: <TimestampMemo timestamp={timestamp} />,
      //amountLabel,
    }
  }, [getRanks, rankType])

  // loader
  const [showLoader, setShowLoader] = useState<boolean>(true)
  useEffect(() => {
    setShowLoader(isLoading)
  }, [isLoading])

  const csvHeaders = [
    { label: "Rank", key: "rank" },
    { label: "Code", key: "code" },
    { label: "Chain", key: "chain" },
    { label: "Address", key: "address" },
    { label: "Purpose", key: "purpose" },
    { label: "Balance (USD)", key: "usd" },
  ];
  
  const csvData = ranks
  
  return (
    
    <>
      <CSVLink 
        data={csvData} 
        headers={csvHeaders} 
        filename={'vo_accounts_' + (new Date().toISOString() + '.csv')}
        onClick={() => {
          console.log("링크 클릭함");
        }}
        >
        CSV Download
      </CSVLink>

      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-4">
        <H3 title={` ${ranks.length ? ranks.length : ''}`} />
        <div className="grow shrink md:grow-0 md:shrink-0">
          <SelectTab<string>
            tabItems={rankTypeTabItems}
            selectedValue={rankType}
            onChange={handleRankTypeSelect}
            className="!TYPO-BODY-S"
          />
        </div>
      </div>

      <Lists
        isLoading={showLoader}
        title={`${rankType} 총 ${ranks.length ? ranks.length : ''} 개의 계정`}
        ranks={ranks}
        //memo={ranksTime}
        // amountLabel={amountLabel}
      />
    </>
  )
}
