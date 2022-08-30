import Textarea from 'components/Inputs/Textarea'
import Modal from 'components/Modal'
import { toastError, toastSuccess } from 'components/Toast/generator'
import { postLSVPenaltyConfirm } from 'data/api'
import LSVPenaltyContent from 'pages/components/LSVPenaltyContent'
import { useState } from 'react'
import { LSV, LSVPenaltyConfirmPost, Penalty } from 'types/lsv'

export default function LSVPenaltyConfirmModal({
  active,
  lsv,
  penalty,
  onClose,
}: {
  active: boolean
  lsv: LSV
  penalty: Penalty
  onClose: () => void
}) {
  const [isModalLoading, setIsModalLoading] = useState<boolean>(false)

  // input
  const [confirmMsg, setConfirmMsg] = useState<string>('')

  const resetModalInput = () => {
    setConfirmMsg('')
  }

  const terminate = () => {
    onClose()
    setIsModalLoading(false)
    resetModalInput()
  }

  const onConfirmClick = async (confirm: boolean) => {
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
    if (success) toastSuccess('Confirmed successfully')
    else if (!success && message) if (message) toastError(message)

    terminate()
  }

  return (
    <Modal
      active={active}
      onClose={terminate}
      onNo={() => onConfirmClick(false)}
      onOk={() => onConfirmClick(true)}
      okButtonLabel="Confirm"
      okButtonColor="danger"
      noButtonLabel="Discard"
      noButtonColor="neutral"
      isLoading={isModalLoading}
    >
      <div className="space-y-4">
        <LSVPenaltyContent title={`${lsv.alias} to get ${penalty.type.toLowerCase()}?`} penalty={penalty} />
        <Textarea placeholder="Confirming, leave a comment if any" keyword={confirmMsg} onChange={setConfirmMsg} />
      </div>
    </Modal>
  )
}
