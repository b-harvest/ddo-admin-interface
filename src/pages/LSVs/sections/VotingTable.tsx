import TableList from 'components/TableList'
import type { ListFieldObj } from 'components/TableList/types'
import Toggler from 'components/Toggler'
import VotingOptionIcon from 'components/VotingOptionIcon'
import { SAFE_VOTING_RATE, VOTE_OPTIONS, WARNABLE_VOTE_OPTIONS } from 'constants/lsv'
import { AN_HOUR } from 'constants/time'
import useLSVPenalty from 'hooks/useLSVPenalty'
import useProposal from 'hooks/useProposal'
import LSVPenaltyContent from 'pages/components/LSVPenaltyContent'
import LSVPenaltyIcon from 'pages/components/LSVPenaltyIcon'
import LSVVoteWarningModal from 'pages/components/LSVVoteWarningModal'
import VotingOptionsLegend from 'pages/components/VotingOptionsLegend'
import { useCallback, useMemo, useState } from 'react'
import { LSV, PENALTY_STATUS, Vote } from 'types/lsv'
import type { ProposalStatus } from 'types/proposal'
import { isMobile } from 'utils/userAgent'

type LSVVotingRecord = {
  validator: LSV
  vote: Vote | undefined
  option: number
  optionLabel: JSX.Element
}

type LSVVotingTableItem = { proposalId: number; pStatus: ProposalStatus; statusLabel: JSX.Element | null } & {
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
      const pStatus = proposal.proposal.status
      const statusLabel = getStatusTagByProposal(proposal.proposalId)
      const votesByValidator: { [key: string]: LSVVotingRecord } = list
        .map((item) => {
          const vote = item.voteData?.votes.find((vote) => vote.proposalId === proposalId)
          const na = item.lsvStartTimestamp + AN_HOUR > new Date(proposal.proposal.voting_end_time).getTime()
          const option: VOTE_OPTIONS = na ? VOTE_OPTIONS.NA : vote?.vote.option ?? VOTE_OPTIONS.DidNot
          const optionLabel = <WrappedVotingOptionIcon lsv={item} proposalId={proposalId} option={option} />

          return { [item.addr]: { validator: item, vote, option, optionLabel } }
        })
        .reduce((accm, item) => ({ ...accm, ...item }), {})

      return { proposalId, pStatus, statusLabel, ...votesByValidator } as LSVVotingTableItem
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
          value: item.addr,
          displayValue: 'optionLabel',
          objSortValue: 'option',
          type: 'object',
          displayType: 'html',
          align: 'center',
          clickable: true,
          tooltip: true,
        }
      }),
    [list]
  )

  const [isTableFitMode, setIsTableFitMode] = useState<boolean>(isMobile ? false : true)

  // warning modal
  const [modal, setModal] = useState<boolean>(false)
  const [modalLSV, setModalLSV] = useState<LSV | undefined>()
  const [modalProposalId, setModalProposalId] = useState<number>(0)
  const [forcePost, setForcePost] = useState<boolean>(false)

  const onCellClick = (cell: LSVVotingRecord, field: string, row: LSVVotingTableItem) => {
    const warnable = WARNABLE_VOTE_OPTIONS.includes(cell.option)
    if (warnable) {
      setModalLSV(cell.validator)
      setModalProposalId(row.proposalId)
      setModal(true)
    }
  }

  const onCellTooltip = (cell: LSVVotingRecord, field: string, row: LSVVotingTableItem) => {
    const warnable = WARNABLE_VOTE_OPTIONS.includes(cell.option)
    return warnable ? (
      <LSVWarningTooltip lsv={cell.validator} proposalId={row.proposalId} option={cell.option} />
    ) : undefined
  }

  const onFieldClick = useCallback(
    (field: string) => {
      const lsv = list.find((lsv) => lsv.addr === field)
      if (lsv) {
        setModalProposalId(0)
        setForcePost(true)
        setModalLSV(lsv)
        setModal(true)
      }
    },
    [list]
  )

  const onFieldTooltip = useCallback(
    (field: string) => {
      const lsv = list.find((lsv) => lsv.addr === field)
      if (lsv) {
        return `${lsv.alias} warned? click to post`
      } else return undefined
    },
    [list]
  )

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
        onCellTooltip={onCellTooltip}
        onFieldClick={onFieldClick}
        onFieldTooltip={onFieldTooltip}
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
            sortValue: 'pStatus',
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

      {modalLSV && (
        <LSVVoteWarningModal
          active={modal}
          lsv={modalLSV}
          proposalId={modalProposalId}
          forcePost={forcePost}
          onClose={() => {
            setForcePost(false)
            setModal(false)
          }}
        />
      )}
    </>
  )
}

function WrappedVotingOptionIcon({ lsv, proposalId, option }: { lsv: LSV; proposalId: number; option: VOTE_OPTIONS }) {
  const { getRepVotePenaltyByProposal } = useLSVPenalty(lsv.addr)
  const penalty = getRepVotePenaltyByProposal(proposalId)

  return (
    <div className="relative flex justify-center items-center">
      <VotingOptionIcon option={option} />
      {penalty ? (
        <div className="absolute -right-4 flex items-center gap-1">
          <LSVPenaltyIcon penalty={penalty} />
        </div>
      ) : null}
    </div>
  )
}

function LSVWarningTooltip({ lsv, proposalId, option }: { lsv: LSV; proposalId: number; option: VOTE_OPTIONS }) {
  const { getRepVotePenaltyByProposal } = useLSVPenalty(lsv.addr)
  const penalty = getRepVotePenaltyByProposal(proposalId)

  return (
    <>
      {isMobile ? null : penalty && penalty.status !== PENALTY_STATUS.Discarded && option === VOTE_OPTIONS.DidNot ? (
        <div className="w-[400px] p-4">
          <LSVPenaltyContent title={lsv.alias} proposalId={proposalId} penalty={penalty} />
        </div>
      ) : (
        `Click to post a warning to vote on #${proposalId}`
      )}
    </>
  )
}
