import H4 from 'components/H4'
import Input from 'components/Inputs/Input'
import Textarea from 'components/Inputs/Textarea'
import Modal from 'components/Modal'
import { VOTE_WARNING_STATUS } from 'constants/lsv'
import { LSV_VOTE_WARN_REFERENCE_SEPERATOR } from 'constants/msg'
import { postLSVEvent } from 'data/api'
import useLSVPenalty from 'hooks/useLSVPenalty'
import LSVWarningContent from 'pages/components/LSVWarningContent'
import { useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import type { LSV, LSVVoteWarnPost } from 'types/lsv'
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
  const { getRepVotePenaltyByProposal } = useLSVPenalty(lsv.addr)
  const penalty = getRepVotePenaltyByProposal(proposalId)

  // modal
  const [isModalLoading, setIsModalLoading] = useState<boolean>(false)

  // if postable
  const [modalRefLink, setModalRefLink] = useState<string>('')
  const [modalMemo, setModalMemo] = useState<string>('')

  const resetModalInput = () => {
    setModalRefLink('')
    setModalMemo('')
  }

  const onSaveButtonDisabled = useMemo<boolean>(() => !isValidUrl(modalRefLink), [modalRefLink])

  const onSave = async () => {
    setIsModalLoading(true)

    // regId ?
    const postData: LSVVoteWarnPost = {
      event_type: 'vote_warning',
      json: {
        addr: lsv.addr,
        desc: `${modalRefLink}${LSV_VOTE_WARN_REFERENCE_SEPERATOR}${modalMemo}`,
        proposalId,
      },
    }
    const res = await postLSVEvent(postData)
    console.log('postLSVEvent', res)

    resetModalInput()
  }

  // if not postable
  const history = useHistory()
  const onSeeDetails = () => {
    history.push(`/lsv/${lsv.valOperAddr}`)
  }

  // onClose
  const handleClose = () => {
    onClose()
    setIsModalLoading(false)
    resetModalInput()
  }

  return (
    <>
      {penalty ? (
        <Modal
          active={active}
          onClose={handleClose}
          onOk={onSeeDetails}
          okButtonLabel={
            penalty.status === VOTE_WARNING_STATUS.Warned
              ? 'Confirm warning'
              : penalty.status === VOTE_WARNING_STATUS.Penalty
              ? 'Confirm penalty'
              : 'See penalty board'
          }
          okButtonColor={
            [VOTE_WARNING_STATUS.Warned, VOTE_WARNING_STATUS.Penalty].includes(penalty.status) ? 'danger' : 'primary'
          }
          isLoading={isModalLoading}
        >
          <LSVWarningContent title={`${lsv.alias}`} proposalId={proposalId} penalty={penalty} />
        </Modal>
      ) : (
        <Modal
          active={active}
          onClose={handleClose}
          onOk={onSave}
          okButtonLabel="Save"
          okButtonDisabled={onSaveButtonDisabled}
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
              invalidMsg="Please input a valid url"
            />
            <Textarea placeholder="Memo (optional)" keyword={modalMemo} onChange={setModalMemo} />
          </div>
        </Modal>
      )}
    </>
  )
}
