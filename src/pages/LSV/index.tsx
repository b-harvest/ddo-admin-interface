import BigNumber from 'bignumber.js'
import AppPage from 'components/AppPage'
import Card from 'components/Card'
import CopyHelper from 'components/CopyHelper'
import ExplorerLink from 'components/ExplorerLink'
import H3 from 'components/H3'
import Hr from 'components/Hr'
import Icon from 'components/Icon'
import Indicator from 'components/Indicator'
import TableList from 'components/TableList'
import Tag from 'components/Tag'
import VotingOptionIcon from 'components/VotingOptionIcon'
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
  voted: boolean
  votedLabel: JSX.Element | null
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

  const { allProposals } = useProposal()
  const engagementTableList = useMemo<LSVVoteRecord[]>(() => {
    return lsv
      ? allProposals.map((proposal) => {
          const proposalId = Number(proposal.proposal_id)
          const title = proposal.content.title
          const vote = lsv.voteData?.votes.find((v) => v.proposalId === proposalId)
          const voted = vote !== undefined
          const votedLabel = voted ? <Icon type="success" /> : null

          const option = vote?.vote.option ?? 5
          const optionLabel = <VotingOptionIcon option={vote?.vote.option} />
          const votingEndTime = new Date(proposal.voting_end_time).getTime()
          const votingEndTimeLabel = dayjs(proposal.voting_end_time).format(DATE_FORMAT)
          const liveTag = votingEndTime >= new Date().getTime() ? <Tag status="info">Live</Tag> : null
          const weight = vote ? new BigNumber(vote.vote.weight) : undefined

          return {
            ...vote?.vote,
            proposalId,
            title,
            voted,
            votedLabel,
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

  // console.log(lsv)

  return (
    <AppPage>
      {lsv ? (
        <>
          <header className="flex justify-between items-center gap-x-2 mb-8">
            <div className="flex items-center gap-x-3">
              <H3 title={`${lsv.alias}`} />
              {lsv.immediateKickout ? <Tag status="error">Immediate Kick-out</Tag> : <Tag status="success">Good</Tag>}
            </div>
            <ExplorerLink validator={lsv.addr} />
          </header>

          <section className="flex flex-col items-start gap-y-2 mb-8">
            <ValAddr title="Operator address " addr={lsv.valOperAddr} />
            <ValAddr title="Consensus address" addr={lsv.valConsAddr} />
            <ValAddr title="Address          " addr={lsv.addr} />
          </section>

          <section className="flex flex-col md:flex-row items-stretch md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-10">
            <ValIndicatorCard title="Jail time" value={`${lsv.jailUntilTimestamp}`} error={lsv.jailed} />
            <ValIndicatorCard title="Commission rate" value={`${lsv.commission}%`} error={lsv.commission > 20} />
            <ValIndicatorCard
              title="Missed blocks counted"
              value={`${lsv.missingBlockCounter}`}
              warning={lsv.missingBlockCounter > 0}
            />
          </section>
          {/* 
          <section className="flex flex-col md:flex-row items-stretch md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-10">
            <ValIndicatorCard
              title="Tombstoned"
              value={`${lsv.tombstoned === 0 ? 'Never' : ''}`}
              error={lsv.tombstoned !== 0}
            />
            
          </section> */}

          <Hr />

          <section className="pt-8">
            <H3 title="Voting History" />
            <div className="mt-2 mb-4">
              <span className="TYPO-BODY-S mr-2">Participated</span>
              <span title={lsv.addr} className="FONT-MONO">
                {new BigNumber(lsv.votingRatio).decimalPlaces(2, BigNumber.ROUND_DOWN).toFormat()}%{' '}
                {lsv.voteData ? `(${lsv.voteData.voteCnt}/${lsv.voteData.mustVoteCnt})` : null}
              </span>
            </div>

            <TableList<LSVVoteRecord>
              title="Voting History"
              showTitle={false}
              nowrap={true}
              memo={<VotingOptionsLegend />}
              defaultSortBy="option"
              defaultIsSortASC={true}
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
                  // responsive: true,
                  clickable: true,
                },
                {
                  label: 'Voted',
                  value: 'votedLabel',
                  sortValue: 'voted',
                  type: 'html',
                  align: 'center',
                  widthRatio: 2,
                  responsive: true,
                },
                {
                  label: 'Option',
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
