import TableList from 'components/TableList'
import type { ListFieldObj } from 'components/TableList/types'
import Toggler from 'components/Toggler'
import VotingOptionIcon from 'components/VotingOptionIcon'
import { SAFE_VOTING_RATE, VOTE_OPTIONS, WARNABLE_VOTE_OPTIONS } from 'constants/lsv'
import useProposal from 'hooks/useProposal'
import LSVWarningModal from 'pages/components/LSVWarningModal'
import VotingOptionsLegend from 'pages/components/VotingOptionsLegend'
import { useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import type { LSV, Vote } from 'types/lsv'
import type { ProposalStatus } from 'types/proposal'
import { isMobile } from 'utils/userAgent'

type LSVVotingRecord = {
  validator: LSV
  vote: Vote | undefined
  option: number
  optionLabel: JSX.Element
}

type LSVVotingTableItem = { proposalId: number; status: ProposalStatus; statusLabel: JSX.Element | null } & {
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
  const { allProposals, getStatusTagByProposal } = useProposal()

  const allLSVVotingTableList = useMemo<LSVVotingTableItem[]>(() => {
    return allProposals.map((proposal) => {
      const proposalId = proposal.proposalId
      const status = proposal.proposal.status
      const statusLabel = getStatusTagByProposal(proposal.proposalId)
      const votesByValidator: { [key: string]: LSVVotingRecord } = list
        .map((item) => {
          const vote = item.voteData?.votes.find((vote) => vote.proposalId === proposalId)
          const na = item.lsvStartTimestamp > new Date(proposal.proposal.voting_end_time).getTime()
          const option = na ? VOTE_OPTIONS.NA : vote?.vote.option ?? VOTE_OPTIONS.DidNot
          const optionLabel = <VotingOptionIcon option={option} />

          return { [item.valOperAddr]: { validator: item, vote, option, optionLabel } }
        })
        .reduce((accm, item) => ({ ...accm, ...item }), {})

      return { proposalId, status, statusLabel, ...votesByValidator } as LSVVotingTableItem
    })
  }, [list, allProposals, getStatusTagByProposal])

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

  const [isTableFitMode, setIsTableFitMode] = useState<boolean>(isMobile ? false : true)

  // warning modal
  const [modal, setModal] = useState<boolean>(false)
  const [modalLSV, setModalLSV] = useState<LSV | undefined>()
  const [modalProposalId, setModalProposalId] = useState<number | undefined>()

  // on cellClick
  const history = useHistory()
  const onCellClick = (cell: LSVVotingRecord, field: string, row: LSVVotingTableItem) => {
    // history.push(`/lsv/${cell.validator.valOperAddr}`)
    const warnable = WARNABLE_VOTE_OPTIONS.includes(cell.option)
    if (warnable) {
      setModalLSV(cell.validator)
      setModalProposalId(row.proposalId)
      setModal(true)
    }
  }

  return (
    <>
      <TableList<LSVVotingTableItem>
        title="Governance Participation"
        isLoading={isLoading}
        nowrap={true}
        overflow={!isTableFitMode}
        cellMinWidthPx={isTableFitMode ? 0 : 130}
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
          {
            label: '',
            value: 'statusLabel',
            sortValue: 'status',
            type: 'html',
            widthRatio: 5,
            align: 'left',
            clickable: true,
          },
          ...tableFields,
        ]}
      />
      {isMobile ? null : (
        <div className="flex items-center justify-end gap-x-2 mt-4">
          <Toggler<boolean>
            onChange={setIsTableFitMode}
            className="w-max flex items-center justify-end gap-x-2"
            label="Table mode"
            tabItems={[
              {
                label: 'Scrollable',
                value: true,
              },
              {
                label: 'Screen-fit',
                value: false,
              },
            ]}
          />
        </div>
      )}

      {modalLSV && modalProposalId && (
        <LSVWarningModal active={modal} lsv={modalLSV} proposalId={modalProposalId} onClose={() => setModal(false)} />
      )}
    </>
  )
}
