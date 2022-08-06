import TableList from 'components/TableList'
import Tag from 'components/Tag'
import TimestampMemo from 'components/TimestampMemo'
import { SAFE_VOTING_RATE } from 'constants/lsv'
import { useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import type { LSV } from 'types/lsv'

type LSVAdditional = {
  aliasLabel: JSX.Element
  statusTag: JSX.Element | null
  filter?: string[]
}

export default function LSVList({ timestamp, list }: { timestamp?: number; list: LSV[] }) {
  const allLSVTableList = useMemo<(LSV & LSVAdditional)[]>(() => {
    return list.map((item) => {
      const aliasLabel = <div className="TYPO-BODY-S !font-bold">{item.alias}</div>

      const jailedTag = item.jailed ? <Tag status="error">Jailed</Tag> : null
      const commissionTag = item.commission > 20 ? <Tag status="error">Commission {'>'} 20%</Tag> : null
      const lowVotingTag = item.votingRate < SAFE_VOTING_RATE ? <Tag status="error">Low voting rate</Tag> : null
      const statusTag =
        jailedTag || commissionTag || lowVotingTag ? (
          <div className="flex flex-col justify-end items-end gap-y-1">
            {jailedTag}
            {commissionTag}
            {lowVotingTag}
          </div>
        ) : (
          <Tag status="success">Good</Tag>
        )

      return {
        ...item,
        aliasLabel,
        statusTag,
        filter: item.immediateKickout ? ['kickout'] : ['safe'],
      }
    })
  }, [list])

  const history = useHistory()
  const onRowClick = (item: LSV & LSVAdditional) => {
    history.push(`/lsv/${item.valOperAddr}`)
  }

  return (
    <TableList<LSV & LSVAdditional>
      title="All LSV"
      showTitle={false}
      useSearch={true}
      useNarrow={true}
      memo={<TimestampMemo timestamp={timestamp} />}
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
          widthRatio: 10,
        },
        {
          label: 'Address',
          value: 'valOperAddr',
          widthRatio: 30,
          responsive: true,
        },
        {
          label: 'Missed blocks',
          value: 'missingBlockCounter',
          widthRatio: 2,
          align: 'center',
          responsive: true,
        },
        {
          label: 'Jail time',
          value: 'jailUntilTimestamp',
          align: 'center',
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
