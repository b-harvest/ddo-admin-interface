import BigNumber from 'bignumber.js'
import TableList from 'components/TableList'
import Tag from 'components/Tag'
import TimestampMemo from 'components/TimestampMemo'
import { SAFE_VOTING_RATE } from 'constants/lsv'
import { useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import type { LSV } from 'types/lsv'

type LSVAdditional = {
  blockCommitTime: BigNumber | undefined
  blockCommitTimeLabel: string
  aliasLabel: JSX.Element
  statusTag: JSX.Element | null
  filter?: string[]
}

export default function LSVList({
  timestamp,
  list,
  isLoading,
}: {
  timestamp?: number
  list: LSV[]
  isLoading: boolean
}) {
  const allLSVTableList = useMemo<(LSV & LSVAdditional)[]>(() => {
    return list.map((item) => {
      const blockCommitTime = item.lastProposingBlock
        ? new BigNumber(item.lastProposingBlock.blockCommitTime)
        : undefined
      const blockCommitTimeLabel = blockCommitTime?.toFormat() ?? '-'

      const aliasLabel = <div className="TYPO-BODY-S !font-bold">{item.alias}</div>

      const jailedTag = item.jailed ? <Tag status="error">Jailed</Tag> : null
      const commissionTag = item.commission > 20 ? <Tag status="error">Commission {'>'} 20%</Tag> : null
      const lowVotingTag = item.votingRate < SAFE_VOTING_RATE ? <Tag status="warning">Low voting rate</Tag> : null
      const slowBlockTimeTag =
        blockCommitTime && blockCommitTime.isGreaterThan(5000) ? (
          <Tag status="warning">Block commit time {'>'} 5s</Tag>
        ) : null

      const statusTag =
        jailedTag || commissionTag || lowVotingTag || slowBlockTimeTag ? (
          <div className="flex flex-col justify-end items-end gap-y-1">
            {jailedTag}
            {commissionTag}
            {lowVotingTag}
            {/* {slowBlockTimeTag} */}
          </div>
        ) : (
          <Tag status="success">Good</Tag>
        )

      return {
        ...item,
        blockCommitTime,
        blockCommitTimeLabel,
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
      isLoading={isLoading}
      showTitle={false}
      useNarrow={true}
      useSearch={true}
      memo={<TimestampMemo timestamp={timestamp} />}
      list={allLSVTableList}
      defaultSortBy={'kickout'}
      defaultIsSortASC={false}
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
          label: 'Jail time',
          value: 'jailUntilTimestamp',
          type: 'number',
          widthRatio: 2,
          responsive: true,
          assertThoughResponsive: true,
        },
        {
          label: 'Commission',
          value: 'commission',
          type: 'change',
          neutral: true,
          widthRatio: 2,
          responsive: true,
          assertThoughResponsive: true,
        },
        {
          label: 'Missed blocks',
          value: 'missingBlockCounter',
          type: 'number',
          widthRatio: 2,
          responsive: true,
          assertThoughResponsive: true,
        },
        {
          label: 'Block commit time (ms)',
          value: 'blockCommitTimeLabel',
          sortValue: 'blockCommitTime',
          type: 'number',
          gt: 5000,
          gtCSS: 'text-error dark:text-warning',
          widthRatio: 6,
          responsive: true,
          assertThoughResponsive: true,
        },
        {
          label: 'Voting rate',
          value: 'votingRate',
          type: 'change',
          neutral: true,
          widthRatio: 2,
          responsive: true,
          assertThoughResponsive: true,
        },
        {
          label: 'Penalty',
          value: 'penaltyTotal',
          type: 'number',
          gt: 0,
          gtCSS: 'text-error dark:text-warning',
          widthRatio: 2,
          responsive: true,
          assertThoughResponsive: true,
        },
        {
          label: 'Status',
          value: 'statusTag',
          sortValue: 'kickout',
          type: 'html',
          align: 'right',
          responsive: true,
        },
      ]}
    />
  )
}
