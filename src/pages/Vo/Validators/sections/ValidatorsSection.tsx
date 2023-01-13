import { useEffect, useMemo, useState } from 'react'
import useValidators from 'hooks/vo/useValidators'
import ValidatorListComp from '../components/ValidatorList'
import TimestampMemo from 'components/TimestampMemo'
import Button from 'components/Button'
import { CSVLink, CSVDownload } from "react-csv";
import type { ValidatorListDataOmit } from 'types/vo/validators'

export default function ValidatorsSection() {
  // fetch data
  const { resTypes, getData, isLoading } = useValidators()
  const [type, setType] = useState<string>(resTypes[0] ?? 'total')
  const { ressTotal, timestamp } = getData(type)
  const resTime:JSX.Element = <TimestampMemo timestamp={timestamp} />
  
  //console.log(ressTotal)

  // loader
  const [showLoader, setShowLoader] = useState<boolean>(true)
  useEffect(() => {
    setShowLoader(isLoading)
  }, [isLoading])

  //download csv
  // let csvHeaders= [
  //   //{ label: "Timestamp", key: "timestamp" },
  // ];
  let csvHeaders: { label:string, key:string }[] = []
  if(ressTotal.length > 0) {
    Object.keys(ressTotal[0]).forEach(function(item){
      csvHeaders.push({ "label": item, "key": item })
    })
  }

  return (
    <>
      <section className="mt-10 mb-5">
        <div className="flex justify-end gap-2 mt-4">
          <div className="inline-block">
            <CSVLink 
            data={ressTotal} 
            headers={csvHeaders} 
            filename={'vo_transactions_' + (new Date().toISOString() + '.csv')}
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
      <ValidatorListComp
        isLoading={showLoader}
        title={`${type} 총 ${ressTotal.length ? ressTotal.length : ''} 개의 계정`}
        resData={ressTotal}
        memo={resTime}
      />
    </>
  )
}