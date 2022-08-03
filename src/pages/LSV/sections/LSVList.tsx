import BigNumber from 'bignumber.js'
import TableList from 'components/TableList'
import Tag from 'components/Tag'
import TimestampMemo from 'components/TimestampMemo'
import { DATE_FORMAT } from 'constants/time'
import dayjs from 'dayjs'
import useLSV from 'hooks/useLSV'
import { useMemo } from 'react'
import type { LSV } from 'types/lsv'

const LSV_FILTER_OPTIONS = [
  {
    label: 'Immediate Kick-out',
    value: 'kickout',
  },
  {
    label: 'Safe',
    value: 'safe',
  },
]

type LSVAdditional = {
  since: string
  aliasLabel: JSX.Element
  missingBlocks: BigNumber
  kickoutTag: JSX.Element | null
  filter?: string[]
}

export default function LSVList() {
  const { allLSVTimestamp, allLSV } = useLSV()

  const allLSVTableList = useMemo<(LSV & LSVAdditional)[]>(() => {
    return allLSV.map((item) => {
      const since = dayjs(item.lsvStartTimestamp).format(DATE_FORMAT)
      const aliasLabel = <div className="TYPO-BODY-S !font-bold">{item.alias}</div>
      const missingBlocks = new BigNumber(item.missingBlockCounter)
      const jailedTag = item.jailed ? <Tag status="error">Jailed</Tag> : null
      const commissionTag = item.commission > 20 ? <Tag status="error">Over 20%</Tag> : null
      const kickoutTag = item.immediateKickout ? (
        <div className="flex justify-end items-center space-x-2">
          {jailedTag}
          {commissionTag}
        </div>
      ) : (
        <Tag status="success">Safe</Tag>
      )

      return {
        ...item,
        since,
        aliasLabel,
        missingBlocks,
        kickoutTag,
        filter: item.immediateKickout ? ['kickout'] : ['safe'],
      }
    })
  }, [allLSV])

  return (
    <TableList<LSV & LSVAdditional>
      title="All LSV"
      useSearch={true}
      useNarrow={true}
      memo={<TimestampMemo timestamp={allLSVTimestamp} />}
      list={allLSVTableList}
      filterOptions={LSV_FILTER_OPTIONS}
      defaultSortBy={'kickout'}
      defaultIsSortASC={false}
      nowrap={true}
      fields={[
        {
          label: 'LSV',
          value: 'aliasLabel',
          sortValue: 'alias',
          type: 'html',
          widthRatio: 2,
        },
        {
          label: 'Address',
          value: 'addr',
          widthRatio: 30,
          responsive: true,
        },
        {
          label: 'Since',
          value: 'since',
          sortValue: 'lsvStartTimestamp',
          widthRatio: 2,
          responsive: true,
        },
        {
          label: 'Missed blocks',
          value: 'missingBlocks',
          widthRatio: 2,
          type: 'bignumber',
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
          label: 'Immediate kick-out',
          value: 'kickoutTag',
          sortValue: 'kickout',
          type: 'html',
          widthRatio: 10,
          align: 'right',
        },
        // {
        //   label: 'Kickout',
        //   value: 'kickout',
        //   type: 'change',
        //   neutral: true,
        //   responsive: true,
        // },
        // {
        //   label: 'APR',
        //   value: 'apr',
        //   type: 'change',
        //   neutral: true,
        // },
        // {
        //   label: '+bCRE',
        //   value: 'bcreApr',
        //   type: 'change',
        //   strong: true,
        //   align: 'left',
        //   responsive: true,
        // },
        // {
        //   label: 'TVL',
        //   value: 'tvlUSD',
        //   type: 'usd',
        //   toFixedFallback: 0,
        // },
      ]}
    />
  )
}
