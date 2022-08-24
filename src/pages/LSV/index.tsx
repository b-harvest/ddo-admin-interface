import BigNumber from 'bignumber.js'
import AppPage from 'components/AppPage'
import Card from 'components/Card'
import CopyHelper from 'components/CopyHelper'
import ExplorerLink from 'components/ExplorerLink'
import H3 from 'components/H3'
import Hr from 'components/Hr'
// import Icon from 'components/Icon'
import Indicator from 'components/Indicator'
import TableList from 'components/TableList'
import Tag from 'components/Tag'
import TimestampMemo from 'components/TimestampMemo'
import VotingOptionIcon from 'components/VotingOptionIcon'
import { SAFE_VOTING_RATE } from 'constants/lsv'
import { DATE_FORMAT } from 'constants/time'
import dayjs from 'dayjs'
import useLSV from 'hooks/useLSV'
import useLSVEvent from 'hooks/useLSVEvent'
import useProposal from 'hooks/useProposal'
import VotingOptionsLegend from 'pages/components/VotingOptionsLegend'
import { useMemo } from 'react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import type { LSV } from 'types/lsv'
import type { ProposalStatus } from 'types/proposal'
import { openProposalById } from 'utils/browser'
import { openExplorerByHeight } from 'utils/browser'
import { abbrOver } from 'utils/text'

import LSVVotingWarnButton from './components/LSVVotingWarnButton'
import LSVWarnedModal from './components/LSVWarnedModal'
import LSVWarningModal from './components/LSVWarningModal'
import LSVPenalty from './sections/LSVPenalty'

type LSVVoteRecord = {
  proposalId: number
  status: ProposalStatus
  statusLabel: JSX.Element | null
  title: string
  optionLabel: JSX.Element | null
  option: number
  optionAlias?: string | undefined
  weight?: BigNumber | undefined
  votingEndTime: number
  votingEndTimeLabel: string
  warnLabel: JSX.Element | null
}

export default function LSVDetail() {
  const { id }: { id: string } = useParams()
  const { findLSVByAddr } = useLSV()
  const lsv = useMemo<LSV | undefined>(() => findLSVByAddr(id), [id, findLSVByAddr])

  const blockCommitTime = lsv?.lastProposingBlock ? new BigNumber(lsv.lastProposingBlock.blockCommitTime) : undefined
  const proposingBlockHeight = lsv?.lastProposingBlock?.height ?? '-'

  const jailedTag = lsv?.jailed ? <Tag status="error">Jailed</Tag> : null
  const commissionTag = lsv?.commission && lsv.commission > 20 ? <Tag status="error">Commission {'>'} 20%</Tag> : null
  const lowVotingTag =
    lsv?.votingRate && lsv.votingRate < SAFE_VOTING_RATE ? <Tag status="warning">Low voting rate</Tag> : null
  const slowBlockTimeTag =
    blockCommitTime && blockCommitTime.isGreaterThan(5000) ? (
      <Tag status="warning">Block commit time {'>'} 5s</Tag>
    ) : null

  const statusTag =
    jailedTag || commissionTag || lowVotingTag || slowBlockTimeTag ? (
      <div className="flex flex-col md:flex-row items-start gap-y-1 md:gap-x-1">
        {jailedTag}
        {commissionTag}
        {lowVotingTag}
        {slowBlockTimeTag}
      </div>
    ) : (
      <Tag status="success">Good</Tag>
    )

  // voting history
  const { votePenalties, isLoading: isLSVEventDataLoading } = useLSVEvent(lsv?.addr ?? '')

  // modal
  // const [isModalLoading, setIsModalLoading] = useState<boolean>(false)
  const [modalProposalId, setModalProposalId] = useState<number | undefined>()

  const [warnedModal, setWarnedModal] = useState<boolean>(false)
  const [warningModal, setWarningModal] = useState<boolean>(false)

  const handleWarnButtonClick = ({ proposalId, warned }: { proposalId: number; warned: boolean }) => {
    setModalProposalId(proposalId)
    warned ? setWarnedModal(true) : setWarningModal(true)
  }

  const { allProposals, getStatusTagByProposal } = useProposal()
  const engagementTableList = useMemo<LSVVoteRecord[]>(() => {
    return lsv
      ? allProposals.map((proposal) => {
          const proposalId = Number(proposal.proposalId)
          const status = proposal.proposal.status
          const statusLabel = getStatusTagByProposal(proposal.proposalId)
          const title = proposal.proposal.content.title
          const vote = lsv.voteData?.votes.find((v) => v.proposalId === proposalId)

          const na = lsv.lsvStartTimestamp > new Date(proposal.proposal.voting_end_time).getTime()
          const option = na ? 6 : vote?.vote.option ?? 5
          const optionLabel = <VotingOptionIcon option={option} />
          const votingEndTime = new Date(proposal.proposal.voting_end_time).getTime()
          const votingEndTimeLabel = dayjs(proposal.proposal.voting_end_time).format(DATE_FORMAT)
          const weight = vote ? new BigNumber(vote.vote.weight) : undefined

          const penalties = votePenalties.filter((item) => item.rawJson?.proposalId === proposalId)
          const warned = penalties.findIndex((item) => item.event === 'vote_warning') > -1
          const penalized = penalties.findIndex((item) => item.event === 'vote_penalty') > -1

          const warnLabel = lsv ? (
            <LSVVotingWarnButton
              warned={warned}
              penalized={penalized}
              onClick={() => handleWarnButtonClick({ proposalId, warned: warned || penalized })}
            />
          ) : null

          return {
            ...vote?.vote,
            proposalId,
            status,
            statusLabel,
            title,
            option,
            optionLabel,
            votingEndTime,
            votingEndTimeLabel,
            weight,
            warnLabel,
          }
        })
      : []
  }, [allProposals, lsv, getStatusTagByProposal])

  const onCellClick = (cell: any, field: string, row: LSVVoteRecord) => {
    if (['proposalId', 'title'].includes(field)) {
      openProposalById(row.proposalId)
    } else if (['votingEndTimeLabel', 'statusLabel', 'optionLabel', 'weight'].includes(field)) {
    }
  }

  return (
    <AppPage>
      {lsv ? (
        <>
          <header className="flex justify-between items-start md:items-center gap-x-2 mb-2">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-y-2 md:gap-x-3">
              <H3 title={`${lsv.alias}`} />
              {statusTag}
            </div>
            <ExplorerLink validator={lsv.addr} />
          </header>

          <div className="TYPO-BODY-XS md:TYPO-BODY-S mb-8">
            <TimestampMemo
              label={`Since block height ${lsv.blockStartHeight}    • `}
              timestamp={lsv.lsvStartTimestamp}
            />
          </div>

          <section className="flex flex-col items-start gap-y-2 mb-8">
            <ValAddr title="Operator address " addr={lsv.valOperAddr} />
            <ValAddr title="Consensus address" addr={lsv.valConsAddr} />
            <ValAddr title="Address          " addr={lsv.addr} />
          </section>

          {/* Indicators */}
          <section className="flex flex-col md:flex-row items-stretch space-y-4 md:space-y-0 md:space-x-4 mb-10">
            <ValIndicatorCard title="Jail time" value={`${lsv.jailUntilTimestamp}`} error={lsv.jailed} />
            <ValIndicatorCard title="Commission rate" value={`${lsv.commission}%`} error={lsv.commission > 20} />
            <ValIndicatorCard
              title="Missed blocks counted"
              value={`${lsv.missingBlockCounter}`}
              warning={lsv.missingBlockCounter > 0}
            />
            <ValIndicatorCard
              title="Last block commit time (ms)"
              value={`${blockCommitTime?.toFormat() ?? '-'}`}
              warning={blockCommitTime?.isGreaterThan(5000)}
              label={`height ${proposingBlockHeight}`}
              onLabelClick={() => openExplorerByHeight(proposingBlockHeight)}
            />
          </section>

          <Hr />
          <LSVPenalty address={lsv.addr} penaltyPoint={lsv.penaltyTotal} />
          <Hr />

          {/* Voting */}
          <section className="pt-8">
            <H3 title="Voting" />
            <div className="mt-2 mb-4">
              <span className="TYPO-BODY-S mr-2">Participated</span>
              <span title={lsv.addr} className="FONT-MONO">
                {new BigNumber(lsv.votingRate).decimalPlaces(2, BigNumber.ROUND_DOWN).toFormat()}%{' '}
                {lsv.voteData ? `(${lsv.voteData.voteCnt}/${lsv.voteData.mustVoteCnt})` : null}
              </span>
            </div>

            <TableList<LSVVoteRecord>
              title="Voting History"
              showTitle={false}
              useNarrow={true}
              nowrap={true}
              memo={<VotingOptionsLegend />}
              defaultSortBy="proposalId"
              defaultIsSortASC={false}
              list={engagementTableList}
              onCellClick={onCellClick}
              fields={[
                {
                  label: 'Proposal #',
                  value: 'proposalId',
                  widthRatio: 2,
                  clickable: true,
                },
                {
                  label: 'Title',
                  value: 'title',
                  widthRatio: 30,
                  responsive: true,
                  clickable: true,
                },
                {
                  label: 'Closing date',
                  value: 'votingEndTimeLabel',
                  sortValue: 'votingEndTime',
                  widthRatio: 4,
                  align: 'right',
                  responsive: true,
                  clickable: true,
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
                {
                  label: 'Voted',
                  value: 'optionLabel',
                  sortValue: 'option',
                  widthRatio: 2,
                  type: 'html',
                  align: 'center',
                  clickable: true,
                },
                {
                  label: 'Weight',
                  value: 'weight',
                  type: 'bignumber',
                  widthRatio: 2,
                  clickable: true,
                },
                {
                  label: 'Warned',
                  value: 'warnLabel',
                  type: 'html',
                  align: 'right',
                  widthRatio: 6,
                },
              ]}
            />
            <LSVWarnedModal
              active={warnedModal}
              lsv={lsv}
              proposalId={modalProposalId ?? 0}
              penalties={votePenalties}
              onClose={() => setWarnedModal(false)}
            />
            <LSVWarningModal
              active={warningModal}
              lsv={lsv}
              proposalId={modalProposalId ?? 0}
              onClose={() => setWarningModal(false)}
            />
          </section>
        </>
      ) : null}
    </AppPage>
  )
}

function ValAddr({ title, addr }: { title: string; addr: string }) {
  return (
    <div className="flex items-center gap-x-2">
      <Tag status="neutral">{title}</Tag>
      <CopyHelper toCopy={addr} iconPosition="left">
        <span className="overflow-hidden text-ellipsis text-grayCRE-300 hover:text-grayCRE-200 dark:hover:text-grayCRE-400">
          <span className="inline md:hidden">{abbrOver(addr, 14)}</span>
          <span className="hidden md:inline">{addr}</span>
        </span>
      </CopyHelper>
    </div>
  )
}

function ValIndicatorCard({
  title,
  label,
  onLabelClick,
  value,
  error,
  warning,
}: {
  title: string
  label?: string
  onLabelClick?: (label: string) => void
  value: string
  error?: boolean
  warning?: boolean
}) {
  return (
    <Card useGlassEffect={true} className="grow shrink basis-auto md:basis-[33%]">
      <Indicator title={title} light={true} className="TYPO-BODY-L !font-bold">
        <div className="">
          <div className={`FONT-MONO ${error ? 'text-error' : warning ? 'text-warning' : ''}`}>{value}</div>
          {label ? (
            <div
              className={`TYPO-BODY-XS text-grayCRE-300 mt-1 ${onLabelClick ? 'cursor-pointer' : ''}`}
              onClick={onLabelClick ? () => onLabelClick(label) : undefined}
            >
              {label}
            </div>
          ) : null}
        </div>
      </Indicator>
    </Card>
  )
}
