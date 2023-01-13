import { EventCategory, EventName } from 'analytics/constants'
import googleAnalytics from 'analytics/googleAnalytics'
import mixpanel from 'analytics/mixpanel'
import TableList from 'components/TableList'
import Tag from 'components/Tag'
import { useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import type { ValidatorListDataOmit } from 'types/vo/validators'

type AliasTag = {
  aliasTag: JSX.Element | null
}

export default function ValidatorList({
  title,
  resData,
  memo,
  //amountLabel,
  isLoading,
}: {
  title: string
  resData: ValidatorListDataOmit[]
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

  const ranksTableList = useMemo<(ValidatorListDataOmit & AliasTag)[]>(
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
    <TableList<ValidatorListDataOmit>
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
          label: 'chain',
          value: 'chain',
          widthRatio: 5,
          clickable: true,
        },
        {
          label: 'OperatorAddress',
          value: 'operatorAddress',
          widthRatio: 28,
          clickable: true,
        },
        {
          label: 'type',
          value: 'type',
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
          label: 'Unit',
          value: 'amountUnit',
          widthRatio: 5,
          clickable: true,
        },
        // {
        //   label: 'denom',
        //   value: 'denom',
        //   widthRatio: 5,
        //   clickable: true,
        // },
        // {
        //   label: 'Height',
        //   value: 'height',
        //   type: 'number',
        //   widthRatio: 5,
        //   clickable: true,
        // },
        {
          label: 'USD',
          value: 'inUsd',
          type: 'usd',
          widthRatio: 10,
          clickable: true,
        },
        // {
        //   label: 'Symbol',
        //   value: 'symbol',
        //   widthRatio: 5,
        //   clickable: true,
        // },
        {
          label: 'Variation',
          value: 'variationBig',
          type: 'bignumber',
          toFixedFallback: 6,
          widthRatio: 10,
          clickable: true,
        },
        {
          label: 'VariationValue',
          value: 'variationValue',
          type: 'number',
          widthRatio: 10,
          clickable: true,
        },
        {
          label: 'time',
          value: 'time',
          widthRatio: 10,
          clickable: true,
        },
      ]}
    />
  )
}
