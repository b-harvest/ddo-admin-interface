import { EventCategory, EventName } from 'analytics/constants'
import googleAnalytics from 'analytics/googleAnalytics'
import mixpanel from 'analytics/mixpanel'
import TableList from 'components/TableList'
import Tag from 'components/Tag'
import { useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import type { VotesListData } from 'types/vo/votes'

type AliasTag = {
  aliasTag: JSX.Element | null
}

export default function VoteList({
  title,
  resData,
  memo,
  //amountLabel,
  isLoading,
}: {
  title: string
  resData: VotesListData[]
  // memo: JSX.Element
  memo: JSX.Element
  //amountLabel?: string
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

  const ranksTableList = useMemo<(VotesListData & AliasTag)[]>(
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
    <TableList<VotesListData>
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
          label: 'WalletCode',
          value: 'walletCode',
          widthRatio: 10,
          clickable: true,
        },
        {
          label: 'chain',
          value: 'chain',
          widthRatio: 5,
          clickable: true,
        },
        {
          label: 'Address',
          value: 'address',
          widthRatio: 18,
          clickable: true,
        },
        {
          label: 'FeeAmount',
          value: 'feeAmountBig',
          type: 'bignumber',
          toFixedFallback: 5,
          widthRatio: 10,
          clickable: true,
        },
        {
          label: 'FeeAmountDenom',
          value: 'feeDenom',
          widthRatio: 5,
          clickable: true,
        },
        {
          label: 'TxHash',
          value: 'txHash',
          widthRatio: 20,
          clickable: true,
        },
        {
          label: 'Height',
          value: 'height',
          type: 'number',
          widthRatio: 10,
          clickable: true,
        },
        // {
        //   label: 'Note',
        //   value: 'note',
        //   widthRatio: 10,
        //   clickable: true,
        // },
        // {
        //   label: 'Option',
        //   value: 'option',
        //   widthRatio: 10,
        //   clickable: true,
        // },
        {
          label: 'Prop ID',
          value: 'proposalId',
          type: 'number',
          widthRatio: 10,
          clickable: true,
        },
        {
          label: 'Time',
          value: 'timestamp',
          widthRatio: 10,
          clickable: true,
        },
      ]}
    />
  )
}
