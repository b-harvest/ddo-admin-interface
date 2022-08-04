import { useAllProposalsLCD } from 'data/useLCD'
import { useMemo } from 'react'
import type { ProposalLCDRaw } from 'types/proposal'

const useProposal = () => {
  const { data: allProposalsLCDData } = useAllProposalsLCD({})

  const allProposals = useMemo<ProposalLCDRaw[]>(() => allProposalsLCDData?.proposals ?? [], [allProposalsLCDData])

  return { allProposals }
}

export default useProposal
