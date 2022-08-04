import BigNumber from 'bignumber.js'
import TableList from 'components/TableList'
import Tag from 'components/Tag'
import TimestampMemo from 'components/TimestampMemo'
import useLSV from 'hooks/useLSV'
import { useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import type { LSV } from 'types/lsv'

type LSVAdditional = {
  aliasLabel: JSX.Element
  missingBlocks: BigNumber
  statusTag: JSX.Element | null
  filter?: string[]
}

export default function LSVList() {
  const { allLSVTimestamp, allLSV } = useLSV()

  const allLSVTableList = useMemo<(LSV & LSVAdditional)[]>(() => {
    return allLSV.map((item) => {
      // const since = dayjs(item.lsvStartTimestamp).format(DATE_FORMAT)
      const aliasLabel = <div className="TYPO-BODY-S !font-bold">{item.alias}</div>
      const missingBlocks = new BigNumber(item.missingBlockCounter)
      const jailedTag = item.jailed ? <Tag status="error">Jailed</Tag> : null
      const commissionTag = item.commission > 20 ? <Tag status="error">Commission over 20%</Tag> : null
      const statusTag = item.immediateKickout ? (
        <div className="flex flex-col justify-end items-end gap-y-1">
          {jailedTag}
          {commissionTag}
        </div>
      ) : (
        <Tag status="success">Good</Tag>
      )

      return {
        ...item,
        aliasLabel,
        missingBlocks,
        statusTag,
        filter: item.immediateKickout ? ['kickout'] : ['safe'],
      }
    })
  }, [allLSV])

  const history = useHistory()
  const onRowClick = (item: LSV & LSVAdditional) => {
    history.push(`/lsv/${item.valOperAddr}`)
  }

  return (
    <TableList<LSV & LSVAdditional>
      title="All LSV"
      useSearch={true}
      useNarrow={true}
      memo={<TimestampMemo timestamp={allLSVTimestamp} />}
      list={allLSVTableList}
      defaultSortBy={'kickout'}
      defaultIsSortASC={false}
      nowrap={true}
      onRowClick={onRowClick}
      fields={[
        {
          label: 'Validator',
          value: 'aliasLabel',
          sortValue: 'alias',
          type: 'html',
          widthRatio: 2,
        },
        {
          label: 'Address',
          value: 'valOperAddr',
          widthRatio: 30,
          responsive: true,
        },
        {
          label: 'Missed blocks',
          value: 'missingBlocks',
          widthRatio: 2,
          type: 'bignumber',
          align: 'center',
          responsive: true,
        },
        {
          label: 'Voting rate',
          value: 'votingRatio',
          type: 'change',
          neutral: true,
          widthRatio: 2,
          responsive: true,
        },
        {
          label: 'Commission',
          value: 'commission',
          type: 'change',
          neutral: true,
          widthRatio: 2,
          responsive: true,
        },
        {
          label: 'Status',
          value: 'statusTag',
          sortValue: 'kickout',
          type: 'html',
          align: 'right',
        },
      ]}
    />
  )
}
