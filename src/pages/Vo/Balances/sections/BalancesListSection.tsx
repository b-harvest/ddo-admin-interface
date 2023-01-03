import { useEffect, useMemo, useState } from 'react'
import useBalancesList from 'hooks/vo/useBalancesList'
import Lists from '../components/Lists'
import TimestampMemo from 'components/TimestampMemo'
import Button from 'components/Button'
import { CSVLink, CSVDownload } from "react-csv";

export default function BalancesListSection() {
  // fetch data
  const { resTypes, getData, isLoading } = useBalancesList()
  
  //const [rankType, setRankType] = useState<string>(rankTypes[0] ?? 'total')
  const [type, setType] = useState<string>(resTypes[0] ?? 'total')
  //console.log(type)
  const { ress, timestamp } = getData(type)
  const resTime:JSX.Element = <TimestampMemo timestamp={timestamp} />
  //console.log(ress)

  // loader
  const [showLoader, setShowLoader] = useState<boolean>(true)
  useEffect(() => {
    setShowLoader(isLoading)
  }, [isLoading])

  //download csv
  const csvHeaders = [
    { label: "Rank", key: "rank" },
    { label: "Chain", key: "chain" },
    { label: "Code", key: "code" },
    { label: "Address", key: "address" },
    { label: "Height", key: "height" },
    { label: "Symbol", key: "symbol" },
    { label: "Denom", key: "denom" },
    { label: "Amount Unit", key: "amountUnit" },
    { label: "Amount", key: "amount" },
    { label: "Variation", key: "variation" },
    { label: "InUsd", key: "inUsd" },
    { label: "InKrw", key: "inKrw" },
    { label: "Time", key: "time" },
  ];
  
  const csvData = ress

  return (
    <>
      <section className="mt-10 mb-5">
        <div className="flex justify-end gap-2 mt-4">
          <div className="inline-block">
            <CSVLink 
            data={csvData} 
            headers={csvHeaders} 
            filename={'vo_accounts_' + (new Date().toISOString() + '.csv')}
            onClick={() => {
              if (confirm('csv파일을 다운로드 받겠습니까?')) {
                return true;
              } else {
                return false;
              }
            }}
            >
            <Button size="sm" label="Download CSV" isLoading={false} />
            </CSVLink>
          </div>
        </div>
      </section>
      <Lists
        isLoading={showLoader}
        title={`${type} 총 ${ress.length ? ress.length : ''} 개의 계정`}
        resData={ress}
        memo={resTime}
        // amountLabel={amountLabel}
      />
    </>
  )
}