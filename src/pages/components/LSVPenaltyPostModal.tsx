import H4 from 'components/H4'
import Input from 'components/Inputs/Input'
import Textarea from 'components/Inputs/Textarea'
import Modal from 'components/Modal'
import { toastSuccess } from 'components/Toast/generator'
import {
  LSV_OBSERVATION_DESC_ENGAGEMENT,
  LSV_OBSERVATION_DESC_RELIABILITY,
  LSV_VOTE_WARN_REFERENCE_SEPERATOR,
} from 'constants/lsv'
import { FIELD_CSS } from 'constants/style'
import { postLSVPenalty } from 'data/api'
import { useMemo, useState } from 'react'
import { LSV, LSVReliabilityWarnPost, LSVVoteWarnPost, WritablePenalty } from 'types/lsv'
import { isValidUrl } from 'utils/text'

type LSVPenaltyPostModalProps = {
  active: boolean
  lsv: LSV
  penaltyItemLabel: string
  event: WritablePenalty
  onClose: () => void
}

export default function LSVPenaltyPostModal({
  active,
  lsv,
  penaltyItemLabel,
  event,
  onClose,
}: LSVPenaltyPostModalProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [modalRefLink, setModalRefLink] = useState<string>('')
  const [modalMemo, setModalMemo] = useState<string>('')
  const saveButtonDisabled = useMemo<boolean>(() => !isValidUrl(modalRefLink), [modalRefLink])

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
        proposalId: 0,
        desc: `${modalRefLink}${LSV_VOTE_WARN_REFERENCE_SEPERATOR}${modalMemo}`,
      },
    }
    return await postLSVPenalty(postData)
  }

  const postReliabilityWarning = async () => {
    const postData: LSVReliabilityWarnPost = {
      event_type: 'reliability_warning',
      json: {
        addr: lsv.addr,
        desc: `${modalRefLink}${LSV_VOTE_WARN_REFERENCE_SEPERATOR}${modalMemo}`,
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
      <H4 title={`${lsv.alias}, \nwarned against ${penaltyItemLabel}?`} className="mb-4" />
      <p className={`${FIELD_CSS} whitespace-pre-line mb-6`}>
        {event === 'vote_warning' ? LSV_OBSERVATION_DESC_ENGAGEMENT : LSV_OBSERVATION_DESC_RELIABILITY}
      </p>

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
  )
}
