import H4 from 'components/H4'
import Input from 'components/Inputs/Input'
import Textarea from 'components/Inputs/Textarea'
import Modal from 'components/Modal'
import { toastSuccess } from 'components/Toast/generator'
import { LSV_OBSERVATION_DESC_ENGAGEMENT, LSV_OBSERVATION_DESC_RELIABILITY } from 'constants/lsv'
import { FIELD_CSS } from 'constants/style'
import { postLSVPenalty } from 'data/api'
import { useMemo, useState } from 'react'
import { LSV, LSVReliabilityWarnPost, LSVVoteWarnPost, WritablePenalty } from 'types/lsv'
import { isValidUrl } from 'utils/text'

type LSVPenaltyPostModalProps = {
  active: boolean
  lsv: LSV
  proposalId?: number
  penaltyItemLabel: string
  event: WritablePenalty
  onClose: () => void
}

export default function LSVPenaltyPostModal({
  active,
  lsv,
  proposalId = 0,
  penaltyItemLabel,
  event,
  onClose,
}: LSVPenaltyPostModalProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [modalRefLink, setModalRefLink] = useState<string>('')
  const [modalMemo, setModalMemo] = useState<string>('')
  const saveButtonDisabled = useMemo<boolean>(
    () => !(isValidUrl(modalRefLink) && (event === 'vote_warning' || modalMemo.length > 0)),
    [modalRefLink, event, modalMemo]
  )

  const resetModalInput = () => {
    setModalRefLink('')
    setModalMemo('')
  }

  const terminate = () => {
    setIsLoading(false)
    resetModalInput()
    onClose()
    // mutate
  }

  const postVoteWarning = async () => {
    const postData: LSVVoteWarnPost = {
      event_type: 'vote_warning',
      json: {
        addr: lsv.addr,
        proposalId,
        link: modalRefLink,
        desc: modalMemo,
      },
    }
    return await postLSVPenalty(postData)
  }

  const postReliabilityWarning = async () => {
    const postData: LSVReliabilityWarnPost = {
      event_type: 'reliability_warning',
      json: {
        addr: lsv.addr,
        link: modalRefLink,
        desc: modalMemo,
      },
    }
    return await postLSVPenalty(postData)
  }

  const onSaveClick = async () => {
    setIsLoading(true)

    const { success } = event === 'vote_warning' ? await postVoteWarning() : await postReliabilityWarning()
    if (success) toastSuccess('Saved successfully')

    terminate()
  }

  return (
    <Modal
      active={active}
      onClose={terminate}
      isLoading={isLoading}
      okButtonLabel="Save"
      okButtonDisabled={saveButtonDisabled}
      onOk={onSaveClick}
    >
      <H4
        title={`${lsv.alias}, \nwarned ${proposalId ? 'to vote on ' + proposalId : 'against ' + penaltyItemLabel}?`}
        className="mb-4"
      />
      {proposalId === 0 ? (
        <p className={`${FIELD_CSS} whitespace-pre-line mb-6`} style={{ wordBreak: 'keep-all' }}>
          {event === 'vote_warning' ? LSV_OBSERVATION_DESC_ENGAGEMENT : LSV_OBSERVATION_DESC_RELIABILITY}
        </p>
      ) : null}

      <div className="space-y-2">
        <Input
          type="text"
          placeholder="Reference link"
          keyword={modalRefLink}
          onChange={setModalRefLink}
          validate={isValidUrl}
          invalidMsg="Please fill out with a valid url."
        />
        <Textarea
          placeholder={`Description ${event === 'vote_warning' ? '(optional)' : ''}`}
          keyword={modalMemo}
          onChange={setModalMemo}
        />
      </div>
    </Modal>
  )
}
