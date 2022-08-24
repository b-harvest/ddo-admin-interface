import Tag from 'components/Tag'
import { useProposals } from 'data/useAPI'
import { useAllProposalsLCD } from 'data/useLCD'
import { useCallback, useMemo } from 'react'
import type { ProposalLCDRaw, ProposalRaw } from 'types/proposal'
import type { ProposalStatus } from 'types/proposal'

const useProposal = () => {
  const { data: allProposalsLCDData } = useAllProposalsLCD({})
  const { data: allProposalsData } = useProposals({})

  const allProposalsLCD = useMemo<ProposalLCDRaw[]>(() => allProposalsLCDData?.proposals ?? [], [allProposalsLCDData])
  const allProposals = useMemo<ProposalRaw[]>(() => allProposalsData?.data ?? [], [allProposalsData])

  const getStatusTagByProposal = useCallback(
    (proposalId: number) => {
      const proposal = allProposals.find((item) => item.proposalId === proposalId)
      // const status = proposal?.proposal.status
      const status = proposal?.proposalId === 16 ? 'PROPOSAL_STATUS_VOTING_PERIOD' : proposal?.proposal.status // fake for test

      return getProposalStatusTag(status)
    },
    [allProposals]
  )

  return { allProposalsLCD, allProposals, getStatusTagByProposal }
}

export default useProposal

function getProposalStatusTag(status?: ProposalStatus): JSX.Element | null {
  switch (status) {
    case 'PROPOSAL_STATUS_VOTING_PERIOD':
      return <Tag status="strong">Live</Tag>
    case 'PROPOSAL_STATUS_DEPOSIT_PERIOD':
      return <Tag status="strong">Deposit</Tag>
    case 'PROPOSAL_STATUS_PASSED':
      return <Tag status="neutral">Passed</Tag>
    case 'PROPOSAL_STATUS_REJECTED':
      return <Tag status="neutral">Rejected</Tag>
    default:
      return null
  }
}
