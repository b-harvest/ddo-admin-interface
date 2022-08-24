import H4 from 'components/H4'
import Input from 'components/Inputs/Input'
import Textarea from 'components/Inputs/Textarea'
import Modal from 'components/Modal'
import { LSV_VOTE_WARN_REFERENCE_SEPERATOR } from 'constants/msg'
import { useState } from 'react'
import type { LSV, LSVPenaltyWarnPost } from 'types/lsv'

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
  const [isModalLoading, setIsModalLoading] = useState<boolean>(false)

  const [modalRefLink, setModalRefLink] = useState<string>('')
  const [modalMemo, setModalMemo] = useState<string>('')

  const resetModalInput = () => {
    setModalRefLink('')
    setModalMemo('')
  }

  const handleClose = () => {
    onClose()
    setIsModalLoading(false)
    resetModalInput()
  }

  const onSave = () => {
    setIsModalLoading(true)

    // regId ?
    const postData: LSVPenaltyWarnPost = {
      addr: lsv.addr,
      desc: `${modalRefLink}${LSV_VOTE_WARN_REFERENCE_SEPERATOR}${modalMemo}`,
      proposalId,
    }
    resetModalInput()
  }

  return (
    <Modal active={active} onClose={handleClose} onOk={onSave} okButtonLabel="Save" isLoading={isModalLoading}>
      <H4 title={`${lsv.alias}, warned to vote on #${proposalId}?`} className="mb-4" />
      <div className="space-y-2">
        <Input type="text" placeholder="Reference link" keyword={modalRefLink} onChange={setModalRefLink} />
        <Textarea placeholder="Memo (optional)" keyword={modalMemo} onChange={setModalMemo} />
      </div>
    </Modal>
  )
}
