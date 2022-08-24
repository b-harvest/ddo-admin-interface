import CopyHelper from 'components/CopyHelper'
import H4 from 'components/H4'
import Icon from 'components/Icon'
import IconButton from 'components/IconButton'
import Modal from 'components/Modal'
import Tag from 'components/Tag'
import { LSV_VOTE_WARN_REFERENCE_SEPERATOR } from 'constants/msg'
import { FIELD_CSS } from 'constants/style'
import { TIMESTAMP_FORMAT } from 'constants/time'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import type { LSV, LSVEventVoteWarn } from 'types/lsv'

const PENALTY_FIELD_SIZE_CSS = `grow-0 shrink-0 basis-[30%] ${FIELD_CSS}`

export default function LSVWarnedModal({
  active,
  lsv,
  proposalId,
  penalties,
  onClose,
}: {
  active: boolean
  lsv: LSV
  proposalId: number
  penalties: LSVEventVoteWarn[]
  onClose: () => void
}) {
  const penalty = useMemo(() => {
    const list = penalties
      .filter((item) => item.rawJson?.proposalId === proposalId)
      .map((item) => {
        const descs = item.rawJson?.desc.split(LSV_VOTE_WARN_REFERENCE_SEPERATOR)
        const refLink = descs && descs.length === 2 ? descs[0] : undefined
        const desc = descs && descs.length === 2 ? descs[1] : descs ? descs[0] : undefined

        return {
          ...item,
          refLink,
          desc,
        }
      })

    if (list.length === 2) {
      return list.find((item) => item.event === 'vote_penalty')
    } else {
      return list.find((item) => item.event === 'vote_warning')
    }
  }, [penalties, proposalId])

  const isStriked = useMemo<boolean>(() => penalty?.event === 'vote_penalty', [penalty])

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

  return (
    <Modal active={active} onClose={handleClose} okButtonLabel="Save" isLoading={isModalLoading}>
      <div className="flex justify-start items-center gap-2 mb-4">
        <Icon type="warning" className="TYPO-BODY-M" />
        <H4 title={`${lsv.alias} warned to vote`} className="" />
        {isStriked ? <Tag status="warning">1 strike</Tag> : null}
      </div>

      {penalty ? (
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between items-center gap-4">
              <div className={PENALTY_FIELD_SIZE_CSS}>Proposal #</div>
              <div className="grow shrink">{proposalId}</div>
            </div>

            <div className="flex justify-between items-center gap-4">
              <div className={PENALTY_FIELD_SIZE_CSS}>Reference</div>
              <div className="grow shrink TYPO-BODY-L">
                <IconButton
                  type="copylink"
                  className={penalty.refLink ? 'hover:text-info' : 'opacity-40 cursor-not-allowed'}
                  onClick={() => {
                    if (penalty.refLink) window.open(penalty.refLink, '_blank')
                  }}
                />
              </div>
            </div>
            <div className="flex justify-between items-center gap-4">
              <div className={PENALTY_FIELD_SIZE_CSS}>Memo</div>
              <div className={`grow shrink ${penalty.desc ? '' : 'opacity-40'}`}>{penalty.desc ?? '-'}</div>
            </div>
            <div className="flex justify-between items-center gap-4">
              <div className={PENALTY_FIELD_SIZE_CSS}>Date</div>
              <div className="grow shrink TYPO-BODY-XS">{dayjs(penalty.timestamp).format(TIMESTAMP_FORMAT)}</div>
            </div>
            <div className="flex justify-between items-center gap-4">
              <div className={PENALTY_FIELD_SIZE_CSS}>By</div>
              <div className="grow shrink TYPO-BODY-XS">
                <CopyHelper toCopy={penalty.regId} iconPosition="left">
                  {penalty.regId}
                </CopyHelper>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </Modal>
  )
}
