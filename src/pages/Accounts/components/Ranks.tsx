import FoldableSection from 'components/FordableSection'
import TableList from 'components/TableList'
import type { RankData } from 'types/accounts'

export default function TopFarmStaking({
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
  return (
    <FoldableSection label={title} defaultIsOpen={true}>
      <div className="mt-4">
        <TableList
          title={title}
          showTitle={false}
          memo={memo}
          useSearch={true}
          useNarrow={true}
          list={ranks}
          defaultSortBy="usd"
          defaultIsSortASC={false}
          defaultFilterIndex={1}
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
            },
            {
              label: 'Last act block',
              value: 'lastAct',
              align: 'right',
              responsive: true,
            },
            {
              label: amountLabel ?? 'Amount',
              value: 'usd',
              type: 'usd',
              toFixedFallback: 2,
            },
          ]}
        />
      </div>
    </FoldableSection>
  )
}
