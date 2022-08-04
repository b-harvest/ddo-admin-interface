import AppPage from 'components/AppPage'
import Card from 'components/Card'
import CopyHelper from 'components/CopyHelper'
import ExplorerLink from 'components/ExplorerLink'
import H3 from 'components/H3'
import Hr from 'components/Hr'
import Indicator from 'components/Indicator'
import TableList from 'components/TableList'
import Tag from 'components/Tag'
import useLSV from 'hooks/useLSV'
import useProposal from 'hooks/useProposal'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import type { LSV } from 'types/lsv'
import { abbrOver } from 'utils/text'

type LSVVoteRecord = {
  proposalId: number
  voted: boolean
  votedLabel: JSX.Element | null
  option?: number | undefined
  optionAlias?: string | undefined
  weight?: number | undefined
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
          const vote = lsv.voteData?.votes.find((v) => v.proposalId === proposalId)
          const voted = vote !== undefined
          const votedLabel = <Tag status="success">Yes</Tag>

          return { ...vote?.vote, proposalId, voted, votedLabel }
        })
      : []
  }, [allProposals, lsv])

  console.log(lsv)
  return (
    <AppPage>
      {lsv ? (
        <>
          <header className="space-y-1 mb-8">
            <div className="flex justify-between items-center">
              <H3 title={`${lsv.alias}`} />
              <ExplorerLink address={lsv.addr} />
            </div>
            <CopyHelper toCopy={lsv.addr} iconPosition="left">
              <span
                title={lsv.addr}
                className="overflow-hidden text-ellipsis hover:text-grayCRE-400 dark:hover:text-grayCRE-200"
              >
                {abbrOver(lsv.addr, 20)}
              </span>
            </CopyHelper>
          </header>

          <section className="flex flex-col md:flex-row items-stretch md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-10">
            <ValAddressCard title="Operation address" addr={lsv.valOperAddr} />
            <ValAddressCard title="Consensus address" addr={lsv.valConsAddr} />
          </section>

          <Hr />

          <section className="pt-8">
            {/* <H3 title="Cumulative Governance Participation" /> */}
            <TableList
              title="Cumulative Governance Participation"
              list={engagementTableList}
              fields={[
                {
                  label: 'Proposal #',
                  value: 'proposalId',
                },
                {
                  label: 'Voted',
                  value: 'votedLabel',
                  sortValue: 'voted',
                  type: 'html',
                },
              ]}
            />
          </section>
        </>
      ) : null}
    </AppPage>
  )
}

// proposalId: number
// voted: boolean
// option?: number | undefined
// optionAlias?: string | undefined
// weight?: number | undefined

function ValAddressCard({ title, addr }: { title: string; addr: string }) {
  return (
    <Card useGlassEffect={true} className="grow-0 shrink-0 basis-auto md:basis-[50%]">
      <Indicator title={title} light={true} className="TYPO-BODY-M !font-medium">
        <CopyHelper toCopy={addr} iconPosition="left">
          <span className="overflow-hidden text-ellipsis hover:text-grayCRE-400 dark:hover:text-grayCRE-200">
            {addr}
          </span>
        </CopyHelper>
      </Indicator>
    </Card>
  )
}
