import { EventCategory, EventName } from 'analytics/constants'
import googleAnalytics from 'analytics/googleAnalytics'
import mixpanel from 'analytics/mixpanel'
import TableList from 'components/TableList'
import Tag from 'components/Tag'
import { useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import type { ProposalsListData } from 'types/vo/proposals'

type AliasTag = {
  aliasTag: JSX.Element | null
}

export default function ProposalsList({
  title,
  resData,
  memo,
  //amountLabel,
  isLoading,
}: {
  title: string
  resData: ProposalsListData[]
  // memo: JSX.Element
  memo: JSX.Element
  isLoading: boolean
}) {
  const history = useHistory()
  const handleCellClick = (cell, field: string) => {
    if (field === 'addr') {
      googleAnalytics.sendEvent({
        category: EventCategory.ACCOUNT,
        action: EventName.ACCOUNT_FROM_TOP_50_CLICKED,
      })
      mixpanel.track(EventName.ACCOUNT_FROM_TOP_50_CLICKED, {
        cell,
      })

      history.push(`/account/${cell}`)
    }
  }

  const ranksTableList = useMemo<(ProposalsListData & AliasTag)[]>(
    () =>
      resData.map((rank) => {
        const aliasTag = rank ? <Tag status="info">{rank}</Tag> : null
        return {
          ...rank,
          aliasTag,
        }
      }),
    [resData]
  )

  return (
    <TableList<ProposalsListData>
      title={title}
      isLoading={isLoading}
      showTitle={false}
      memo={memo}
      useSearch={true}
      useNarrow={true}
      //list={ranksTableList}
      list={resData}
      defaultSortBy="code"
      //defaultIsSortASC={false}
      //defaultFilterIndex={1}
      onCellClick={handleCellClick}
      fields={[
        {
          label: '#',
          value: 'rank',
          widthRatio: 2,
          responsive: true,
        },
        {
          label: 'Chain',
          value: 'chain',
          widthRatio: 10,
          clickable: true,
        },
        {
          label: 'id',
          value: 'id',
          widthRatio: 5,
          clickable: true,
        },
        {
          label: 'Status',
          value: 'propStatus',
          widthRatio: 13,
          clickable: true,
        },
        {
          label: 'Title',
          value: 'title',
          widthRatio: 20,
          clickable: true,
        },
        {
          label: 'Voted',
          value: 'voted',
          type: 'number',
          widthRatio: 10,
          clickable: true,
        },
        {
          label: 'Time',
          value: 'time',
          widthRatio: 8,
          clickable: true,
        },
        {
          label: 'VotingStartTime',
          value: 'votingStartTime',
          widthRatio: 8,
          clickable: true,
        },
        {
          label: 'VotingEndTime',
          value: 'votingEndTime',
          widthRatio: 8,
          clickable: true,
        },
      ]}
    />
  )
}
