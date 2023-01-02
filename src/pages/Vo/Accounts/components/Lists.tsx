import { EventCategory, EventName } from 'analytics/constants'
import googleAnalytics from 'analytics/googleAnalytics'
import mixpanel from 'analytics/mixpanel'
import TableList from 'components/TableList'
import Tag from 'components/Tag'
import { useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import type { AccountsData } from 'types/vo/accounts'

type AliasTag = {
  aliasTag: JSX.Element | null
}

export default function Lists({
  title,
  ranks,
  //memo,
  //amountLabel,
  isLoading,
}: {
  title: string
  ranks: AccountsData[]
  //memo: JSX.Element
  //amountLabel?: string
  isLoading: boolean
}) {
  console.log('랭크')
  console.log(ranks)
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

  const ranksTableList = useMemo<(AccountsData & AliasTag)[]>(
    () =>
      ranks.map((rank) => {
        const aliasTag = rank ? <Tag status="info">{rank}</Tag> : null
        return {
          ...rank,
          aliasTag,
        }
      }),
    [ranks]
  )
  console.log('여기까진 오냐?')

  return (
    <TableList<AccountsData>
      title={title}
      isLoading={isLoading}
      showTitle={false}
      //memo={memo}
      useSearch={true}
      useNarrow={true}
      //list={ranksTableList}
      list={ranks}
      defaultSortBy="code"
      //defaultIsSortASC={false}
      //defaultFilterIndex={1}
      onCellClick={handleCellClick}
      fields={[
        {
          label: '#',
          value: 'rank',
          widthRatio: 5,
          responsive: true,
        },
        {
          label: 'Code',
          value: 'code',
          widthRatio: 10,
          clickable: true,
        },
        {
          label: 'Chain',
          value: 'chain',
          widthRatio: 10,
          clickable: true,
        },
        {
          label: 'Address',
          value: 'address',
          widthRatio: 45,
          clickable: true,
        },
        {
          label: 'Purpose',
          value: 'purpose',
          widthRatio: 25,
          clickable: true,
        },
        {
          label: 'Balance (USD)',
          value: 'usd',
          type: 'usd',
          widthRatio: 10,
          clickable: true,
        },
        // {
        //   label: '',
        //   value: 'aliasTag',
        //   sortValue: 'alias',
        //   type: 'html',
        //   widthRatio: 16,
        // },
        // {
        //   label: 'Last change block',
        //   value: 'lastAct',
        //   type: 'number',
        //   align: 'center',
        //   widthRatio: 4,
        //   responsive: true,
        // },
        // {
        //   label: amountLabel ?? 'Amount',
        //   value: 'usd',
        //   type: 'usd',
        //   widthRatio: 10,
        // },
      ]}
    />
  )
}
