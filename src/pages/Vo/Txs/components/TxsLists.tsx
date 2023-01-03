import { EventCategory, EventName } from 'analytics/constants'
import googleAnalytics from 'analytics/googleAnalytics'
import mixpanel from 'analytics/mixpanel'
import TableList from 'components/TableList'
import Tag from 'components/Tag'
import { useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import type { TxsListData } from 'types/vo/txs'

type AliasTag = {
  aliasTag: JSX.Element | null
}

export default function TxsLists({
  title,
  resData,
  memo,
  //amountLabel,
  isLoading,
}: {
  title: string
  resData: TxsListData[]
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

  const ranksTableList = useMemo<(TxsListData & AliasTag)[]>(
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
  console.log('여기까진 오냐?')

  return (
    <TableList<TxsListData>
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
          widthRatio: 2,
          clickable: true,
        },
        {
          label: 'WalletCode',
          value: 'walletCode',
          widthRatio: 2,
          clickable: true,
        },
        // {
        //   label: 'Address',
        //   value: 'address',
        //   widthRatio: 35,
        //   clickable: true,
        // },
        {
          label: 'Height',
          value: 'height',
          type: 'number',
          widthRatio: 5,
          clickable: true,
        },
        // {
        //   label: 'Denom',
        //   value: 'denom',
        //   widthRatio: 10,
        //   clickable: true,
        // },
        {
          label: 'TxHash',
          value: 'txHash',
          widthRatio: 25,
          clickable: true,
        },
        {
          label: 'Action',
          value: 'action',
          widthRatio: 10,
          clickable: true,
        },
        {
          label: 'FromAddress',
          value: 'fromAddressShort',
          widthRatio: 10,
          clickable: true,
        },
        {
          label: 'ToAddress',
          value: 'toAddressShort',
          widthRatio: 10,
          clickable: true,
        },
        {
          label: 'Amount',
          value: 'amountBig',
          type: 'bignumber',
          toFixedFallback: 6,
          widthRatio: 10,
          clickable: true,
        },
        {
          label: 'Denom',
          value: 'denom',
          widthRatio: 2,
          clickable: true,
        },
        {
          label: 'InOut',
          value: 'inOut',
          type: 'number',
          widthRatio: 2,
          clickable: true,
        },
        {
          label: 'Timestamp',
          value: 'timestamp',
          widthRatio: 6,
          clickable: true,
        },
        // {
        //   label: 'KRW',
        //   value: 'inKrw',
        //   type: 'number',
        //   widthRatio: 10,
        //   clickable: true,
        // },
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
