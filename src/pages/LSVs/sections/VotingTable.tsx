import { EventName } from 'analytics/constants'
import mixpanel from 'analytics/mixpanel'
import H3 from 'components/H3'
import TableList from 'components/TableList'
import type { ListFieldObj } from 'components/TableList/types'
import Toggler from 'components/Toggler'
import VotingOptionIcon from 'components/VotingOptionIcon'
import { SAFE_VOTING_RATE, VoteOptions, WARNABLE_VOTE_OPTIONS } from 'constants/lsv'
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

  const [isTableFitMode, setIsTableFitMode] = useState<boolean>(isMobile ? false : true)

  const allLSVVotingTableList = useMemo<LSVVotingTableItem[]>(() => {
    return allProposals.map((proposal) => {
      const proposalId = proposal.proposalId
      const pStatus = proposal.proposal.status
      const statusLabel = getStatusTagByProposal(proposal.proposalId)
      const votesByValidator: { [key: string]: LSVVotingRecord } = list
        .map((item) => {
          const vote = item.voteData?.votes.find((vote) => vote.proposalId === proposalId)
          const na = item.lsvStartTimestamp + AN_HOUR > new Date(proposal.proposal.voting_end_time).getTime()
          const option: VoteOptions = na ? VoteOptions.NA : vote?.vote.option ?? VoteOptions.DIDNOT
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
            <div className={`flex flex-col px-2 ${isTableFitMode ? 'items-start' : 'items-center'}`}>
              <span className={`truncate ${isTableFitMode ? 'max-w-[72px]' : ''}`}>{item.alias}</span>
              <span className={`w-full flex justify-center ${item.votingRate < SAFE_VOTING_RATE ? 'text-error' : ''}`}>
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

  // warning modal
  const [modal, setModal] = useState<boolean>(false)
  const [modalLSV, setModalLSV] = useState<LSV | undefined>()
  const [modalProposalId, setModalProposalId] = useState<number>(0)
  const [forcePost, setForcePost] = useState<boolean>(false)

  const onCellClick = (cell: LSVVotingRecord, field: string, row: LSVVotingTableItem) => {
    const warnable = WARNABLE_VOTE_OPTIONS.includes(cell.option)

    mixpanel.track(EventName.LSVS_VOTING_TABLE_CELL_CLICKED, {
      warnable,
    })

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

      mixpanel.track(EventName.LSVS_VOTING_TABLE_FIELD_CLICKED, {
        lsv: lsv?.alias ?? 'Did not worked - No LSV',
      })

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
        return `${lsv.alias} \nClick to post warning`
      } else return undefined
    },
    [list]
  )

  const onSearch = (keyword: string) => {
    mixpanel.track(EventName.LSVS_VOTING_TABLE_SEARCHED, {
      keyword,
    })
  }

  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <H3 title="Governance Participation" />
        {!isMobile && (
          <div className="flex items-center justify-end gap-x-2">
            <Toggler<boolean>
              onChange={setIsTableFitMode}
              className="w-max flex items-center justify-end gap-x-2"
              label="Table mode"
              tabItems={[
                {
                  label: 'to Scrollable',
                  value: true,
                },
                {
                  label: 'to Screen-fit',
                  value: false,
                },
              ]}
            />
          </div>
        )}
      </div>
      <TableList<LSVVotingTableItem>
        title="Governance Participation"
        showTitle={false}
        isLoading={isLoading}
        nowrap={true}
        overflow={!isTableFitMode}
        cellMinWidthPx={isTableFitMode ? 40 : 130}
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
        onSearch={onSearch}
        fields={[
          {
            label: '#',
            value: 'proposalId',
            widthRatio: 2,
            clickable: true,
            excludeMinWidth: true,
          },
          {
            label: '',
            value: 'statusLabel',
            sortValue: 'pStatus',
            type: 'html',
            widthRatio: isTableFitMode ? 5 : 1,
            align: 'left',
            clickable: true,
          },
          ...tableFields,
        ]}
      />

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

function WrappedVotingOptionIcon({ lsv, proposalId, option }: { lsv: LSV; proposalId: number; option: VoteOptions }) {
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

function LSVWarningTooltip({ lsv, proposalId, option }: { lsv: LSV; proposalId: number; option: VoteOptions }) {
  const { getRepVotePenaltyByProposal } = useLSVPenalty(lsv.addr)
  const penalty = getRepVotePenaltyByProposal(proposalId)

  return (
    <>
      {isMobile ? null : penalty && penalty.status !== PENALTY_STATUS.Discarded && option === VoteOptions.DIDNOT ? (
        <div className="w-[400px] p-4">
          <LSVPenaltyContent title={lsv.alias} proposalId={proposalId} penalty={penalty} />
        </div>
      ) : (
        `Click to post a warning to vote on #${proposalId}`
      )}
    </>
  )
}
