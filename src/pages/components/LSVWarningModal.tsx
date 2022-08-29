import H4 from 'components/H4'
import Input from 'components/Inputs/Input'
import Textarea from 'components/Inputs/Textarea'
import Modal from 'components/Modal'
import { toastError, toastSuccess } from 'components/Toast/generator'
import { PENALTY_STATUS } from 'constants/lsv'
import { LSV_VOTE_WARN_REFERENCE_SEPERATOR } from 'constants/msg'
import { postLSVPenaltyConfirm, postLSVVoteWarn } from 'data/api'
import useLSVPenalty from 'hooks/useLSVPenalty'
import LSVWarningContent from 'pages/components/LSVWarningContent'
import { useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import type { LSV, LSVPenaltyConfirmPost, LSVVoteWarnPost, VotePenalty } from 'types/lsv'
import { isValidUrl } from 'utils/text'

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

    const { success } = await postLSVVoteWarn(postData)
    if (success) toastSuccess('Warning saved successfully')

    terminate()
  }

  // if not postable

  const history = useHistory()
  const onConfirmClick = async (penalty: VotePenalty) => {
    if (shouldConfirm(penalty.status)) {
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
    } else {
      history.push(`/lsv/${lsv.valOperAddr}`)
    }
  }

  return (
    <>
      {penalty ? (
        <Modal
          active={active}
          onClose={terminate}
          onOk={() => onConfirmClick(penalty)}
          okButtonLabel={
            penalty.status === PENALTY_STATUS.Warned
              ? 'Confirm warning'
              : penalty.status === PENALTY_STATUS.Penalty
              ? 'Confirm penalty'
              : 'See penalty board'
          }
          okButtonColor={shouldConfirm(penalty.status) ? 'danger' : 'primary'}
          isLoading={isModalLoading}
        >
          <div className="space-y-4">
            <LSVWarningContent title={`${lsv.alias}`} proposalId={proposalId} penalty={penalty} />

            {shouldConfirm(penalty.status) ? (
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
            <Textarea placeholder="Memo (optional)" keyword={modalMemo} onChange={setModalMemo} />
          </div>
        </Modal>
      )}
    </>
  )
}

function shouldConfirm(status: PENALTY_STATUS): boolean {
  return [PENALTY_STATUS.Warned, PENALTY_STATUS.Penalty].includes(status)
}
