import Textarea from 'components/Inputs/Textarea'
import Modal from 'components/Modal'
import { toastError, toastSuccess } from 'components/Toast/generator'
import { postLSVPenalty, postLSVPenaltyConfirm } from 'data/api'
import useLSVPenalty from 'hooks/useLSVPenalty'
import LSVPenaltyContent from 'pages/components/LSVPenaltyContent'
import { useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { LSV, LSVPenaltyConfirmPost, LSVVoteWarnPost, Penalty, PENALTY_TYPE, VotePenalty } from 'types/lsv'
import { PENALTY_STATUS } from 'types/lsv'
import { isValidUrl } from 'utils/text'

import LSVPenaltyPostModal from './LSVPenaltyPostModal'

enum ADMIN_ACTION_ON_PENALTY {
  ConfirmWarning = 'Confirm warning',
  ConfirmPenalty = 'Confirm 1 strike',
  SeePenaltyBoard = 'See penalty board',
  Discard = 'Discard',
}

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

  const [isModalLoading, setIsModalLoading] = useState<boolean>(false)

  // input
  const [modalRefLink, setModalRefLink] = useState<string>('')
  const [modalMemo, setModalMemo] = useState<string>('')
  const [confirmMsg, setConfirmMsg] = useState<string>('')

  const resetModalInput = () => {
    setModalRefLink('')
    setModalMemo('')
    setConfirmMsg('')
  }

  const terminate = () => {
    onClose()
    setIsModalLoading(false)
    resetModalInput()
    mutate()
  }

  const saveButtonDisabled = useMemo<boolean>(() => !isValidUrl(modalRefLink), [modalRefLink])

  const onSaveClick = async () => {
    setIsModalLoading(true)

    const postData: LSVVoteWarnPost = {
      event_type: 'vote_warning',
      json: {
        addr: lsv.addr,
        proposalId,
        link: modalRefLink,
        desc: modalMemo,
      },
    }

    const { success } = await postLSVPenalty(postData)
    if (success) toastSuccess('Warning saved successfully')

    terminate()
  }

  // confirm
  const history = useHistory()
  const seePenaltyBoard = () => {
    history.push(`/lsv/${lsv.valOperAddr}`)
  }

  const confirmPenalty = async (penalty: VotePenalty, confirm: boolean) => {
    setIsModalLoading(true)

    const postData: LSVPenaltyConfirmPost = {
      eid: penalty.eid,
      json: {
        eid: penalty.eid,
        result: confirm ? 'y' : 'd',
        msg: confirmMsg,
      },
    }
    const { success, message } = await postLSVPenaltyConfirm(postData)
    if (success) toastSuccess(`${confirm ? 'Confirmed' : 'Discarded'} successfully`)
    else if (!success && message) if (message) toastError(message)

    terminate()
  }

  const onConfirmClick = async (penalty: VotePenalty, confirm = true) => {
    const adminAction = getAdminAction(penalty)

    if (adminAction === ADMIN_ACTION_ON_PENALTY.SeePenaltyBoard) {
      seePenaltyBoard()
    } else {
      confirmPenalty(penalty, confirm)
    }
  }

  return (
    <>
      {penalty && penalty.status !== PENALTY_STATUS.Discarded ? (
        <Modal
          active={active}
          onClose={terminate}
          onOk={() => onConfirmClick(penalty)}
          okButtonLabel={getAdminAction(penalty)}
          okButtonColor={penalty.status === PENALTY_STATUS.NotConfirmed ? 'danger' : 'primary'}
          onNo={penalty.status === PENALTY_STATUS.NotConfirmed ? () => onConfirmClick(penalty, false) : undefined}
          noButtonLabel={getAdminAction(penalty, false)}
          noButtonColor="neutral"
          isLoading={isModalLoading}
        >
          <div className="space-y-4">
            <LSVPenaltyContent title={`${lsv.alias}`} proposalId={proposalId} penalty={penalty} />

            {penalty.status === PENALTY_STATUS.NotConfirmed ? (
              <Textarea
                placeholder="Confirming, leave a comment if any"
                keyword={confirmMsg}
                onChange={setConfirmMsg}
              />
            ) : null}
          </div>
        </Modal>
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

function getAdminAction(penalty: Penalty, confirm = true) {
  if (penalty.type === PENALTY_TYPE.Warning) {
    return penalty.status === PENALTY_STATUS.NotConfirmed
      ? confirm
        ? ADMIN_ACTION_ON_PENALTY.ConfirmWarning
        : ADMIN_ACTION_ON_PENALTY.Discard
      : ADMIN_ACTION_ON_PENALTY.SeePenaltyBoard
  }
  if (penalty.type === PENALTY_TYPE.Strike) {
    return penalty.status === PENALTY_STATUS.NotConfirmed
      ? confirm
        ? ADMIN_ACTION_ON_PENALTY.ConfirmPenalty
        : ADMIN_ACTION_ON_PENALTY.Discard
      : ADMIN_ACTION_ON_PENALTY.SeePenaltyBoard
  }
  return ADMIN_ACTION_ON_PENALTY.SeePenaltyBoard
}
