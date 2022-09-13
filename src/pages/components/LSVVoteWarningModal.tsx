import Modal from 'components/Modal'
import useLSVPenalty from 'hooks/useLSVPenalty'
import { useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { LSV, VotePenalty } from 'types/lsv'
import { PENALTY_STATUS } from 'types/lsv'

import LSVPenaltyConfirmModal from './LSVPenaltyConfirmModal'
import LSVPenaltyContent from './LSVPenaltyContent'
import LSVPenaltyPostModal from './LSVPenaltyPostModal'

export default function LSVVoteWarningModal({
  active,
  lsv,
  proposalId,
  onClose,
}: {
  active: boolean
  lsv: LSV
  proposalId: number
  onClose: () => void
}) {
  const { getRepVotePenaltyByProposal, mutate } = useLSVPenalty(lsv.addr)
  const penalty = useMemo<VotePenalty | undefined>(
    () => getRepVotePenaltyByProposal(proposalId),
    [getRepVotePenaltyByProposal, proposalId]
  )

  // confirm
  const history = useHistory()
  const seePenaltyBoard = () => {
    history.push(`/lsv/${lsv.valOperAddr}`)
    onClose()
  }

  return (
    <>
      {penalty ? (
        <>
          {penalty.status === PENALTY_STATUS.NotConfirmed ? (
            <LSVPenaltyConfirmModal
              active={active}
              lsv={lsv}
              penalty={penalty}
              onClose={() => {
                mutate()
                onClose()
              }}
            />
          ) : (
            <Modal
              active={active}
              onClose={onClose}
              onOk={seePenaltyBoard}
              okButtonLabel="See penalty board"
              okButtonColor="primary"
              isLoading={false}
            >
              <LSVPenaltyContent title={`${lsv.alias}`} proposalId={proposalId} penalty={penalty} />
            </Modal>
          )}
        </>
      ) : (
        <LSVPenaltyPostModal
          active={active}
          lsv={lsv}
          proposalId={proposalId}
          penaltyItemLabel="Engagement"
          event="vote_warning"
          onClose={() => {
            mutate()
            onClose()
          }}
        />
      )}
    </>
  )
}
