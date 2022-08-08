import TableList from 'components/TableList'
import type { ListFieldObj } from 'components/TableList/types'
import VotingOptionIcon from 'components/VotingOptionIcon'
import { SAFE_VOTING_RATE } from 'constants/lsv'
import useProposal from 'hooks/useProposal'
import VotingOptionsLegend from 'pages/components/VotingOptionsLegend'
import { useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import type { LSV, Vote } from 'types/lsv'

type LSVVotingRecord = {
  validator: LSV
  vote: Vote | undefined
  option: number
  optionLabel: JSX.Element
}

type LSVVotingTableItem = { proposalId: number } & {
  [key: string]: LSVVotingRecord
}

export default function VotingTable({
  timestamp,
  list,
  isLoading,
}: {
  timestamp?: number
  list: LSV[]
  isLoading: boolean
}) {
  const { allProposals } = useProposal()

  const allLSVVotingTableList = useMemo<LSVVotingTableItem[]>(() => {
    return allProposals.map((proposal) => {
      const proposalId = Number(proposal.proposal_id)
      const votesByValidator: { [key: string]: LSVVotingRecord } = list
        .map((item) => {
          const vote = item.voteData?.votes.find((vote) => vote.proposalId === proposalId)
          const na = item.lsvStartTimestamp > new Date(proposal.voting_end_time).getTime()
          const option = na ? 6 : vote?.vote.option ?? 5
          const optionLabel = <VotingOptionIcon option={option} />

          return { [item.valOperAddr]: { validator: item, vote, option, optionLabel } }
        })
        .reduce((accm, item) => ({ ...accm, ...item }), {})

      return { proposalId, ...votesByValidator } as LSVVotingTableItem
    })
  }, [list, allProposals])

  const tableFields = useMemo<ListFieldObj[]>(
    () =>
      list.map((item) => {
        return {
          label: (
            <div className="flex flex-col items-center">
              <span>{item.alias}</span>
              <span className={item.votingRate < SAFE_VOTING_RATE ? 'text-error' : ''}>
                {item.votingRate.toFixed(0)}%
              </span>
            </div>
          ),
          value: item.valOperAddr,
          displayValue: 'optionLabel',
          objSortValue: 'option',
          type: 'object',
          displayType: 'html',
          align: 'center',
          clickable: true,
        }
      }),
    [list]
  )

  const history = useHistory()
  const onCellClick = (cell: LSVVotingRecord, field: string, item: LSVVotingTableItem) => {
    history.push(`/lsv/${cell.validator.valOperAddr}`)
  }

  return (
    <TableList<LSVVotingTableItem>
      title="Governance Participation"
      isLoading={isLoading}
      nowrap={true}
      overflow={true}
      cellMinWidthPx={130}
      useSearch={true}
      useNarrow={true}
      memo={<VotingOptionsLegend />}
      list={allLSVVotingTableList}
      defaultSortBy={'proposalId'}
      defaultIsSortASC={false}
      onCellClick={onCellClick}
      fields={[
        {
          label: '#',
          value: 'proposalId',
          widthRatio: 1,
          clickable: true,
          excludeMinWidth: true,
        },
        ...tableFields,
      ]}
    />
  )
}
