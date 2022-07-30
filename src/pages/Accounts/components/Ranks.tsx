import TableList from 'components/TableList'
import { useHistory } from 'react-router-dom'
import type { RankData } from 'types/accounts'

export default function Ranks({
  title,
  ranks,
  memo,
  amountLabel,
}: {
  title: string
  ranks: RankData[]
  memo: JSX.Element
  amountLabel?: string
}) {
  const history = useHistory()
  const handleCellClick = (cell, field: string) => {
    if (field === 'addr') history.push(`/account/${cell}`)
  }

  return (
    <TableList<RankData>
      title={title}
      showTitle={false}
      memo={memo}
      useSearch={true}
      useNarrow={true}
      list={ranks}
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
          label: 'Last change block',
          value: 'lastAct',
          align: 'right',
          responsive: true,
        },
        {
          label: amountLabel ?? 'Amount',
          value: 'usd',
          type: 'usd',
        },
      ]}
    />
    // </FoldableSection>
  )
}
