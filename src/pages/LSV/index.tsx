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
import useProposal from 'hooks/useProposal'
import VotingOptionsLegend from 'pages/components/VotingOptionsLegend'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import type { LSV } from 'types/lsv'
import { openProposalById } from 'utils/browser'
import { abbrOver } from 'utils/text'

type LSVVoteRecord = {
  proposalId: number
  title: string
  optionLabel: JSX.Element | null
  option: number
  optionAlias?: string | undefined
  weight?: BigNumber | undefined
  votingEndTime: number
  votingEndTimeLabel: string
  liveTag: JSX.Element | null
}

export default function LSVDetail() {
  const { id }: { id: string } = useParams()
  const { findLSVByAddr } = useLSV()
  const lsv = useMemo<LSV | undefined>(() => findLSVByAddr(id), [id, findLSVByAddr])

  const blockCommitTime = lsv?.lastProposingBlock ? new BigNumber(lsv.lastProposingBlock.blockCommitTime) : undefined

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
  const { allProposals } = useProposal()
  const engagementTableList = useMemo<LSVVoteRecord[]>(() => {
    return lsv
      ? allProposals.map((proposal) => {
          const proposalId = Number(proposal.proposal_id)
          const title = proposal.content.title
          const vote = lsv.voteData?.votes.find((v) => v.proposalId === proposalId)

          const na = lsv.lsvStartTimestamp > new Date(proposal.voting_end_time).getTime()
          const option = na ? 6 : vote?.vote.option ?? 5
          const optionLabel = <VotingOptionIcon option={option} />
          const votingEndTime = new Date(proposal.voting_end_time).getTime()
          const votingEndTimeLabel = dayjs(proposal.voting_end_time).format(DATE_FORMAT)
          const liveTag = votingEndTime >= new Date().getTime() ? <Tag status="info">Live</Tag> : null
          const weight = vote ? new BigNumber(vote.vote.weight) : undefined

          return {
            ...vote?.vote,
            proposalId,
            title,
            option,
            optionLabel,
            votingEndTime,
            votingEndTimeLabel,
            liveTag,
            weight,
          }
        })
      : []
  }, [allProposals, lsv])

  const onCellClick = (cell: any, field: string, row: LSVVoteRecord) => openProposalById(row.proposalId)

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

          <section className="flex flex-col md:flex-row items-stretch md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-10">
            {/* <ValIndicatorCard title="CRE" value={`${lsv.tokens.toFormat()}`} /> */}
            <ValIndicatorCard title="Jail time" value={`${lsv.jailUntilTimestamp}`} error={lsv.jailed} />
            <ValIndicatorCard title="Commission rate" value={`${lsv.commission}%`} error={lsv.commission > 20} />
            <ValIndicatorCard
              title="Last block commit time"
              value={`${blockCommitTime?.toFormat() ?? '-'}`}
              warning={blockCommitTime?.isGreaterThan(5000)}
            />
            <ValIndicatorCard
              title="Missed blocks counted"
              value={`${lsv.missingBlockCounter}`}
              warning={lsv.missingBlockCounter > 0}
            />
          </section>

          <Hr />

          <section className="pt-8">
            <H3 title="Voting History" />
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
                  label: 'Vote ended',
                  value: 'votingEndTimeLabel',
                  sortValue: 'votingEndTime',
                  widthRatio: 4,
                  responsive: true,
                  clickable: true,
                },
                {
                  label: '',
                  value: 'liveTag',
                  sortValue: 'votingEndTime',
                  type: 'html',
                  widthRatio: 1,
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
                },
                {
                  label: 'Weight',
                  value: 'weight',
                  type: 'bignumber',
                  widthRatio: 2,
                },
              ]}
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
  value,
  error,
  warning,
}: {
  title: string
  value: string
  error?: boolean
  warning?: boolean
}) {
  return (
    <Card useGlassEffect={true} className="grow shrink basis-auto md:basis-[33%]">
      <Indicator title={title} light={true} className="TYPO-BODY-L !font-bold">
        <div className={`FONT-MONO ${error ? 'text-error' : warning ? 'text-warning' : ''}`}>{value}</div>
      </Indicator>
    </Card>
  )
}
