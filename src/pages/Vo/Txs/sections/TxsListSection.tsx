import { useEffect, useMemo, useState } from 'react'
import useTxsList from 'hooks/vo/useTxsList'
import TxsLists from '../components/TxsLists'
import TimestampMemo from 'components/TimestampMemo'
import Button from 'components/Button'
import { CSVLink, CSVDownload } from "react-csv";

export default function TxsListSection() {
  // fetch data
  const { resTypes, getData, isLoading } = useTxsList()
  const [type, setType] = useState<string>(resTypes[0] ?? 'total')
  const { ress, ressTotal, timestamp } = getData(type)
  const resTime:JSX.Element = <TimestampMemo timestamp={timestamp} />
  
  //console.log(ressTotal)

  // loader
  const [showLoader, setShowLoader] = useState<boolean>(true)
  useEffect(() => {
    setShowLoader(isLoading)
  }, [isLoading])

  //download csv
  const csvHeaders = [
    { label: "Rank", key: "rank" },
    { label: "Chain", key: "chain" },
    { label: "WalletCode", key: "walletCode" },
    { label: "Address", key: "address" },
    { label: "Height", key: "height" },
    { label: "TxHash", key: "txHash" },
    { label: "Action", key: "action" },
    { label: "fromAddress", key: "fromAddress" },
    { label: "toAddress", key: "toAddress" },
    { label: "Amount", key: "amount" },
    { label: "Denom", key: "denom" },
    { label: "InOut", key: "inOut" },
    { label: "FeeAmount", key: "feeAmount" },
    { label: "FeeDenom", key: "feeDenom" },
    { label: "Note", key: "note" },
    { label: "Timestamp", key: "timestamp" },
  ];

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
      <TxsLists
        isLoading={showLoader}
        title={`${type} 총 ${ress.length ? ress.length : ''} 개의 계정`}
        resData={ress}
        memo={resTime}
      />
    </>
  )
}