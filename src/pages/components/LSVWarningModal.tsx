import CopyHelper from 'components/CopyHelper'
import H4 from 'components/H4'
import Icon from 'components/Icon'
import IconButton from 'components/IconButton'
import Input from 'components/Inputs/Input'
import Textarea from 'components/Inputs/Textarea'
import Modal from 'components/Modal'
import Tag from 'components/Tag'
import { LSV_VOTE_WARN_REFERENCE_SEPERATOR } from 'constants/msg'
import { FIELD_CSS } from 'constants/style'
import { TIMESTAMP_FORMAT } from 'constants/time'
import dayjs from 'dayjs'
import useLSVPenalty from 'hooks/useLSVPenalty'
import { useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import type { LSV, LSVEventVoteWarn, LSVPenaltyWarnPost } from 'types/lsv'

const PENALTY_FIELD_SIZE_CSS = `grow-0 shrink-0 basis-[30%] ${FIELD_CSS}`

enum VOTE_WARNING_STATUS {
  Strike = 'vote_penalty',
  Penalty = 'vote_penalty',
  Warned = 'vote_warning',
  NotYet = '',
}

type VotePenalty = LSVEventVoteWarn & {
  status: VOTE_WARNING_STATUS
  refLink: string | undefined
  desc: string | undefined
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
  const { getVotePenaltiesByProposal } = useLSVPenalty(lsv.addr)

  const votePenalties = useMemo<VotePenalty[]>(() => {
    const penalties = getVotePenaltiesByProposal(proposalId)
    return penalties.map((item) => {
      const status = item.event as VOTE_WARNING_STATUS
      const descs = item.rawJson.desc?.split(LSV_VOTE_WARN_REFERENCE_SEPERATOR)
      const refLink = descs && descs.length === 2 ? descs[0] : undefined
      const desc = descs && descs.length === 2 ? descs[1] : descs ? descs[0] : undefined

      return {
        ...item,
        status,
        refLink,
        desc,
      }
    })
  }, [getVotePenaltiesByProposal, proposalId])

  const status = useMemo<VOTE_WARNING_STATUS>(() => {
    const events = votePenalties.map((item) => item.event)
    if (events.includes('vote_penalty')) {
      const event = votePenalties.find((item) => item.event === 'vote_penalty')
      if (event?.confirmResult === 'y') return VOTE_WARNING_STATUS.Strike
      if (event?.confirmResult === 'n') return VOTE_WARNING_STATUS.Penalty
    }
    if (events.includes('vote_warning')) return VOTE_WARNING_STATUS.Warned
    return VOTE_WARNING_STATUS.NotYet
  }, [votePenalties])

  // modal
  const [isModalLoading, setIsModalLoading] = useState<boolean>(false)

  // if postable
  const [modalRefLink, setModalRefLink] = useState<string>('')
  const [modalMemo, setModalMemo] = useState<string>('')

  const resetModalInput = () => {
    setModalRefLink('')
    setModalMemo('')
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

  // if not postable, already warned
  const penalty = useMemo<VotePenalty | undefined>(() => {
    if (status === VOTE_WARNING_STATUS.NotYet) return undefined
    return votePenalties.find((item) => item.status === status)
  }, [status, votePenalties])

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
      {status === VOTE_WARNING_STATUS.NotYet ? (
        <Modal active={active} onClose={handleClose} onOk={onSave} okButtonLabel="Save" isLoading={isModalLoading}>
          <H4 title={`${lsv.alias}, \nwarned to vote on #${proposalId}?`} className="mb-4" />
          <div className="space-y-2">
            <Input type="text" placeholder="Reference link" keyword={modalRefLink} onChange={setModalRefLink} />
            <Textarea placeholder="Memo (optional)" keyword={modalMemo} onChange={setModalMemo} />
          </div>
        </Modal>
      ) : (
        <Modal
          active={active}
          onClose={handleClose}
          onOk={onSeeDetails}
          okButtonLabel="See details"
          okButtonColor="primary"
          isLoading={isModalLoading}
        >
          <ModalReadContent title={`${lsv.alias}`} proposalId={proposalId} penalty={penalty} />
        </Modal>
      )}
    </>
  )
}

function ModalReadContent({
  title,
  proposalId,
  penalty,
}: {
  title: string
  proposalId: number
  penalty?: VotePenalty
}) {
  return (
    <>
      <div className="flex justify-start items-center gap-2 mb-4">
        <Icon type="warning" className="TYPO-BODY-M" />
        <H4 title={title} className="" />
      </div>

      {penalty ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center gap-4">
              <div className={PENALTY_FIELD_SIZE_CSS}>Status</div>
              <div className="grow shrink">{VoteWarningTag({ status: penalty.status })}</div>
            </div>

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
    </>
  )
}

function VoteWarningTag({ status }: { status: VOTE_WARNING_STATUS }) {
  switch (status) {
    case VOTE_WARNING_STATUS.Strike:
      return (
        <Tag status="warning" className="w-max">
          1 strike
        </Tag>
      )
    case VOTE_WARNING_STATUS.Penalty:
      return (
        <Tag status="warning" className="w-max">
          Did not vote after warned
        </Tag>
      )
    case VOTE_WARNING_STATUS.Warned:
      return (
        <Tag status="warning" className="w-max">
          Warned
        </Tag>
      )
    case VOTE_WARNING_STATUS.NotYet:
      return '-'
  }
}
