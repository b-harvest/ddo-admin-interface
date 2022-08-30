import ExplorerLink from 'components/ExplorerLink'
import FoldableCard from 'components/FoldableCard'
import H3 from 'components/H3'
import Icon from 'components/Icon'
import IconButton from 'components/IconButton'
import QuestionTooltip from 'components/QuestionTooltip'
import StrikeBoard from 'components/StrikeBoard'
import Tooltip from 'components/Tooltip'
import {
  IMMEDIATE_KICKOUT_PENALTIES,
  LSV_OBSERVATION_DESC_ACTIVITY,
  LSV_OBSERVATION_DESC_COMMISSION,
  LSV_OBSERVATION_DESC_ENGAGEMENT,
  LSV_OBSERVATION_DESC_PERFORMANCE,
  LSV_OBSERVATION_DESC_RELIABILITY,
  LSV_OBSERVATION_DESC_STABILITY,
  LSV_OBSERVATION_DESC_SUSTAINABILITY,
  PENALTY_TYPE_ICON_MAP,
  WRITABLE_PENALTIES,
} from 'constants/lsv'
import { FIELD_CSS } from 'constants/style'
import { useCallback, useMemo, useState } from 'react'
import { LSV, Penalty, PENALTY_STATUS, PENALTY_TYPE, PenaltyEvent, WritablePenalty } from 'types/lsv'

import LSVPenaltyConfirmModal from './LSVPenaltyConfirmModal'
import LSVPenaltyItems from './LSVPenaltyItems'
import LSVWarningPostModal from './LSVPenaltyPostModal'

type PenaltyItem = { label: string; desc: string; events: PenaltyEvent[]; type: PENALTY_TYPE }
const PENALTY_ITEMS: PenaltyItem[] = [
  {
    label: 'Commission',
    desc: LSV_OBSERVATION_DESC_COMMISSION,
    events: ['commssion_changed'],
    type: PENALTY_TYPE.immediateKickout,
  },
  {
    label: 'Stability',
    desc: LSV_OBSERVATION_DESC_STABILITY,
    events: ['block_missing'],
    type: PENALTY_TYPE.Strike,
  },
  {
    label: 'Sustainability',
    desc: LSV_OBSERVATION_DESC_SUSTAINABILITY,
    events: ['no_signing'],
    type: PENALTY_TYPE.Strike,
  },
  {
    label: 'Reliability',
    desc: LSV_OBSERVATION_DESC_RELIABILITY,
    events: ['reliability_warning', 'reliability_penalty'],
    type: PENALTY_TYPE.Strike,
  },
  {
    label: 'Engagement',
    desc: LSV_OBSERVATION_DESC_ENGAGEMENT,
    events: ['vote_warning', 'vote_penalty'],
    type: PENALTY_TYPE.Strike,
  },
  {
    label: 'Performance',
    desc: LSV_OBSERVATION_DESC_PERFORMANCE,
    events: [],
    type: PENALTY_TYPE.Strike,
  },
  {
    label: 'Activity',
    desc: LSV_OBSERVATION_DESC_ACTIVITY,
    events: ['bad_performance'],
    type: PENALTY_TYPE.Strike,
  },
]

export default function LSVPenaltyBoard({
  lsv,
  penalties,
  penaltyPoint,
  onConfirm,
  onPost,
}: {
  lsv: LSV
  penalties: Penalty[]
  penaltyPoint: number
  onConfirm?: (penalty: Penalty) => void
  onPost?: () => void
}) {
  const strikePoint = useMemo<number>(() => {
    const confirmedIKs = penalties.filter(
      (penalty) => IMMEDIATE_KICKOUT_PENALTIES.includes(penalty.event) && penalty.confirmId
    )
    const IK = confirmedIKs.reduce((accm, item) => accm + item.penaltyPoint, 0)
    return penaltyPoint - IK
  }, [penalties, penaltyPoint])

  const getPenaltiesByEvents = useCallback(
    (events: PenaltyEvent[]) => penalties.filter((penalty) => events.includes(penalty.event)),
    [penalties]
  )

  const getPenaltyPointByEvents = useCallback(
    (events: PenaltyEvent[]) => {
      const totalPoint = getPenaltiesByEvents(events).reduce((accm, penalty) => {
        const confirmedPoint = penalty.status === PENALTY_STATUS.Confirmed ? penalty.penaltyPoint : 0
        return accm + confirmedPoint
      }, 0)

      return totalPoint
    },
    [getPenaltiesByEvents]
  )
  // post modal
  const [postModal, setPostModal] = useState<boolean>(false)
  const [modalPenaltyToPost, setModalPenaltyToPost] = useState<WritablePenalty | undefined>()
  const [modalPenaltyItemToPost, setModalPenaltyItemToPost] = useState<string | undefined>()

  const onWriteButtonClick = (item: PenaltyItem, event: WritablePenalty) => {
    setPostModal(true)
    setModalPenaltyItemToPost(item.label)
    setModalPenaltyToPost(event)
  }

  // confirm modal
  const [confirmModal, setConfirmModal] = useState<boolean>(false)
  const [modalPenalty, setModalPenalty] = useState<Penalty | undefined>()

  const onConfirmClick = (penalty: Penalty) => {
    setModalPenalty(penalty)
    setConfirmModal(true)
  }

  const onConfirmModalClose = () => {
    setConfirmModal(false)
    if (onConfirm && modalPenalty) onConfirm(modalPenalty)
    // ... should mutate the swr
  }

  return (
    <div className="mb-10" id="penalty-board">
      {/* title */}
      <div className="flex justify-between items-start gap-4 py-8">
        <div className="flex flex-col md:flex-row justify-start items-start md:items-center gap-4 ">
          <H3 title="Penalty Board" />
        </div>
        <ExplorerLink proposalId={15} label="Proposal #15" />
      </div>

      {/* strike board */}
      <div className="flex items-center gap-2 mb-4">
        <Tooltip content={`${strikePoint} strike confirmed out of 3`}>
          <StrikeBoard current={strikePoint} max={3} />
        </Tooltip>

        <Tooltip content={`Immediate kickout will be on when confirmed`}>
          <StrikeBoard
            current={penaltyPoint - strikePoint}
            max={1}
            iconType="slash"
            title="Immediate kickout confirmed"
          />
        </Tooltip>
      </div>

      {/* penalty items */}
      <div className="flex flex-col gap-2">
        {PENALTY_ITEMS.map((item) => (
          // overflow-hidden max-h-[24px] hover:max-h-screen transition-all
          <FoldableCard
            key={item.label}
            folded={
              hasPenalty(getPenaltiesByEvents(item.events)) ? (
                <LSVPenaltyItems penalties={getPenaltiesByEvents(item.events)} onConfirmClick={onConfirmClick} />
              ) : null
            }
            showFoldButton={hasPenalty(getPenaltiesByEvents(item.events))}
            defaultShowFolded={hasPenaltyNotConfirmed(getPenaltiesByEvents(item.events))}
          >
            <div
              className={`flex flex-row justify-between items-stretch gap-1 ${
                !hasPenalty(getPenaltiesByEvents(item.events)) ? 'pr-10' : ''
              }`}
            >
              <PenaltyField title={item.label} desc={item.desc}></PenaltyField>

              <div
                className={`grow shrink flex gap-4 md:px-4 md:border-r md:border-l border-grayCRE-300 dark:border-grayCRE-500`}
              >
                {/* confirmed penalty */}
                <div
                  className={`${FIELD_CSS} ${
                    getPenaltyPointByEvents(item.events) > 0 ? '!text-error' : 'invisible'
                  } w-full flex items-center gap-2 whitespace-pre-line`}
                  style={{ wordBreak: 'keep-all' }}
                >
                  <Icon type={PENALTY_TYPE_ICON_MAP[item.type]} />
                  {item.type === PENALTY_TYPE.immediateKickout
                    ? PENALTY_TYPE.immediateKickout
                    : getPenaltyPointByEvents(item.events)}{' '}
                  <span className="hidden md:inline">confirmed</span>
                </div>

                {/* post button */}
                <PenaltyWriteButton penaltyItem={item} onClick={(event) => onWriteButtonClick(item, event)} />
              </div>

              {!hasPenalty(getPenaltiesByEvents(item.events)) ? (
                <Icon type="success" className="absolute top-5 right-5 block w-4 h-4 text-success" />
              ) : null}
            </div>
          </FoldableCard>
        ))}
      </div>

      {/* modals */}
      {modalPenaltyToPost && modalPenaltyItemToPost ? (
        <LSVWarningPostModal
          active={postModal}
          lsv={lsv}
          penaltyItemLabel={modalPenaltyItemToPost}
          event={modalPenaltyToPost}
          onClose={() => {
            setPostModal(false)
            if (onPost) onPost()
          }}
        />
      ) : null}
      {modalPenalty ? (
        <LSVPenaltyConfirmModal active={confirmModal} lsv={lsv} penalty={modalPenalty} onClose={onConfirmModalClose} />
      ) : null}
    </div>
  )
}

function PenaltyField({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="grow-0 shrink-0 basis-[40%] md:basis-[160px] flex justify-start items-start gap-2">
      <div className={FIELD_CSS}>{title}</div>
      <QuestionTooltip desc={desc} />
    </div>
  )
}

function PenaltyWriteButton({
  penaltyItem,
  onClick,
}: {
  penaltyItem: PenaltyItem
  onClick: (event: WritablePenalty) => void
}) {
  // would be refactored using enum
  const writableEvent = penaltyItem.events.find((event) => WRITABLE_PENALTIES.includes(event)) as
    | WritablePenalty
    | undefined

  return (
    <>
      {writableEvent !== undefined ? (
        <Tooltip content="Click to post a warning">
          <IconButton type="plus" className="hover:opacity-40" onClick={() => onClick(writableEvent)} />
        </Tooltip>
      ) : null}
    </>
  )
}

function hasPenalty(penalties: Penalty[]) {
  return penalties.length > 0
}

function hasPenaltyNotConfirmed(penalties: Penalty[]) {
  return penalties.findIndex((penalty) => penalty.status === PENALTY_STATUS.NotConfirmed) > -1
}
