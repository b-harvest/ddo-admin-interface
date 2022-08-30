import H4 from 'components/H4'
import Input from 'components/Inputs/Input'
import Textarea from 'components/Inputs/Textarea'
import Modal from 'components/Modal'
import { toastError, toastSuccess } from 'components/Toast/generator'
import { LSV_VOTE_WARN_REFERENCE_SEPERATOR } from 'constants/lsv'
import { postLSVPenalty, postLSVPenaltyConfirm } from 'data/api'
import useLSVPenalty from 'hooks/useLSVPenalty'
import LSVPenaltyContent from 'pages/components/LSVPenaltyContent'
import { useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { LSV, LSVPenaltyConfirmPost, LSVVoteWarnPost, Penalty, PENALTY_TYPE, VotePenalty } from 'types/lsv'
import { PENALTY_STATUS } from 'types/lsv'
import { isValidUrl } from 'utils/text'

enum ADMIN_ACTION_ON_PENALTY {
  ConfirmWarning = 'Confirm warning',
  ConfirmPenalty = 'Confirm 1 strike',
  SeePenaltyBoard = 'See penalty board',
}

export default function LSVWarningModal({
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
        desc: `${modalRefLink}${LSV_VOTE_WARN_REFERENCE_SEPERATOR}${modalMemo}`,
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

  const confirmPenalty = async (penalty: VotePenalty) => {
    setIsModalLoading(true)

    const postData: LSVPenaltyConfirmPost = {
      eid: penalty.eid,
      json: {
        eid: penalty.eid,
        result: 'y',
        msg: confirmMsg,
      },
    }
    const { success, message } = await postLSVPenaltyConfirm(postData)
    if (success) toastSuccess('Warning saved successfully')
    else if (!success && message) if (message) toastError(message)

    terminate()
  }

  const onConfirmClick = async (penalty: VotePenalty) => {
    const adminAction = getAdminAction(penalty)

    if (adminAction === ADMIN_ACTION_ON_PENALTY.SeePenaltyBoard) {
      seePenaltyBoard()
    } else {
      confirmPenalty(penalty)
    }
  }

  return (
    <>
      {penalty ? (
        <Modal
          active={active}
          onClose={terminate}
          onOk={() => onConfirmClick(penalty)}
          okButtonLabel={getAdminAction(penalty)}
          okButtonColor={penalty.status === PENALTY_STATUS.NotConfirmed ? 'danger' : 'primary'}
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
        <Modal
          active={active}
          onClose={terminate}
          onOk={onSaveClick}
          okButtonLabel="Save"
          okButtonDisabled={saveButtonDisabled}
          isLoading={isModalLoading}
        >
          <H4 title={`${lsv.alias}, \nwarned to vote on #${proposalId}?`} className="mb-4" />
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Reference link"
              keyword={modalRefLink}
              onChange={setModalRefLink}
              validate={isValidUrl}
              invalidMsg="Please fill out with a valid url."
            />
            <Textarea placeholder="Description (optional)" keyword={modalMemo} onChange={setModalMemo} />
          </div>
        </Modal>
      )}
    </>
  )
}

function getAdminAction(penalty: Penalty) {
  if (penalty.type === PENALTY_TYPE.Warning) {
    return penalty.status === PENALTY_STATUS.NotConfirmed
      ? ADMIN_ACTION_ON_PENALTY.ConfirmWarning
      : ADMIN_ACTION_ON_PENALTY.SeePenaltyBoard
  }
  if (penalty.type === PENALTY_TYPE.Strike) {
    return penalty.status === PENALTY_STATUS.NotConfirmed
      ? ADMIN_ACTION_ON_PENALTY.ConfirmPenalty
      : ADMIN_ACTION_ON_PENALTY.SeePenaltyBoard
  }
  return ADMIN_ACTION_ON_PENALTY.SeePenaltyBoard
}
