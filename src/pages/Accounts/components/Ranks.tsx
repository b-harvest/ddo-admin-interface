import { EventCategory, EventName } from 'analytics/constants'
import googleAnalytics from 'analytics/googleAnalytics'
import TableList from 'components/TableList'
import Tag from 'components/Tag'
import { useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import type { RankData } from 'types/accounts'

type AliasTag = {
  aliasTag: JSX.Element | null
}

export default function Ranks({
  title,
  ranks,
  memo,
  amountLabel,
  isLoading,
}: {
  title: string
  ranks: RankData[]
  memo: JSX.Element
  amountLabel?: string
  isLoading: boolean
}) {
  const history = useHistory()
  const handleCellClick = (cell, field: string) => {
    if (field === 'addr') {
      googleAnalytics.sendEvent({
        category: EventCategory.ACCOUNT,
        action: EventName.ACCOUNT_FROM_TOP_50_CLICKED,
      })
      history.push(`/account/${cell}`)
    }
  }

  const ranksTableList = useMemo<(RankData & AliasTag)[]>(
    () =>
      ranks.map((rank) => {
        const aliasTag = rank.alias.length ? <Tag status="info">{rank.alias}</Tag> : null
        return {
          ...rank,
          aliasTag,
        }
      }),
    [ranks]
  )

  return (
    <TableList<RankData & AliasTag>
      title={title}
      isLoading={isLoading}
      showTitle={false}
      memo={memo}
      useSearch={true}
      useNarrow={true}
      list={ranksTableList}
      defaultSortBy="usd"
      defaultIsSortASC={false}
      defaultFilterIndex={1}
      onCellClick={handleCellClick}
      fields={[
        {
          label: 'Rank',
          value: 'rank',
          widthRatio: 1,
          responsive: true,
        },
        {
          label: 'Address',
          value: 'addr',
          clickable: true,
        },
        {
          label: '',
          value: 'aliasTag',
          sortValue: 'alias',
          type: 'html',
          widthRatio: 10,
        },
        {
          label: 'Last change block',
          value: 'lastAct',
          type: 'number',
          align: 'center',
          widthRatio: 4,
          responsive: true,
        },
        {
          label: amountLabel ?? 'Amount',
          value: 'usd',
          type: 'usd',
          widthRatio: 10,
        },
      ]}
    />
  )
}
