import DynamicList from 'components/DynamicList'
import ExplorerLink from 'components/ExplorerLink'
import H3 from 'components/H3'
import Icon from 'components/Icon'
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
import { useCallback, useMemo, useState } from 'react'
import { LSV, Penalty, PENALTY_STATUS, PENALTY_TYPE, PenaltyEvent, WritablePenalty } from 'types/lsv'

import LSVPenaltyConfirmModal from '../../components/LSVPenaltyConfirmModal'
import LSVPenaltyItem from '../../components/LSVPenaltyItem'
import LSVPenaltyPostModal from '../../components/LSVPenaltyPostModal'

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
    events: ['bad_performance'],
    type: PENALTY_TYPE.Strike,
  },
  {
    label: 'Activity',
    desc: LSV_OBSERVATION_DESC_ACTIVITY,
    events: [],
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

  const getPenalties = useCallback(
    (item: PenaltyItem) => penalties.filter((penalty) => item.events.includes(penalty.event)),
    [penalties]
  )

  const [postModal, setPostModal] = useState<boolean>(false)
  const [modalPenaltyToPost, setModalPenaltyToPost] = useState<WritablePenalty | undefined>()
  const [modalPenaltyItemToPost, setModalPenaltyItemToPost] = useState<string | undefined>()

  const onAddButtonClick = (penaltyItem: PenaltyItem) => {
    const event = getWritableEvent(penaltyItem)
    if (event) {
      setPostModal(true)
      setModalPenaltyItemToPost(penaltyItem.label)
      setModalPenaltyToPost(event)
    }
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
    <section className="mb-10" id="penalty-board">
      {/* title */}
      <header className="flex justify-between items-start gap-4 py-8">
        <div className="flex flex-col md:flex-row justify-start items-start md:items-center gap-4 ">
          <H3 title="Penalty Board" />
        </div>
        <ExplorerLink proposalId={15} label="Proposal #15" />
      </header>

      {/* strike board */}
      <div className="flex items-center gap-2 mb-8">
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
      <div className="flex flex-col gap-8">
        {PENALTY_ITEMS.map((item) => (
          <DynamicList
            key={item.label}
            allGood={getPenalties(item).length <= 0}
            title={item.label}
            titleDesc={item.desc}
            memo={PenaltyIndicatorIcon(item, getPenalties(item))}
            onAddButtonClick={getWritableEvent(item) ? () => onAddButtonClick(item) : undefined}
            addButtonLabel="Click to add a warning"
            emptyLabel="No penalty"
            list={getPenalties(item).map((penalty, i) => (
              <LSVPenaltyItem
                key={penalty.eid}
                isLast={i === getPenalties(item).length - 1}
                penalty={penalty}
                direction="row"
                defaultExpanded={false}
                showConfirmButton={true}
                onConfirmClick={() => onConfirmClick(penalty)}
              />
            ))}
          />
        ))}
      </div>

      {/* modals */}
      {modalPenaltyToPost && modalPenaltyItemToPost ? (
        <LSVPenaltyPostModal
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
    </section>
  )
}

function PenaltyIndicatorIcon(penaltyItem: PenaltyItem, penalties: Penalty[]) {
  return (
    <>
      {/* confirmed penalty */}
      {getPenaltyPointByEvents(penalties) > 0 ? (
        <Tooltip
          content={`${
            penaltyItem.type === PENALTY_TYPE.immediateKickout
              ? PENALTY_TYPE.immediateKickout
              : `${getPenaltyPointByEvents(penalties)} strike`
          } confirmed`}
        >
          <div
            className={`flex items-center gap-2 TYPO-BODY-S ${
              penaltyItem.type === PENALTY_TYPE.immediateKickout ? 'text-error' : 'text-warning'
            }`}
          >
            <Icon type={PENALTY_TYPE_ICON_MAP[penaltyItem.type]} />
            {penaltyItem.type !== PENALTY_TYPE.immediateKickout ? getPenaltyPointByEvents(penalties) : null}
          </div>
        </Tooltip>
      ) : null}
    </>
  )
}

function getPenaltyPointByEvents(penalties: Penalty[]) {
  const totalPoint = penalties.reduce((accm, penalty) => {
    const confirmedPoint = penalty.status === PENALTY_STATUS.Confirmed ? penalty.penaltyPoint : 0
    return accm + confirmedPoint
  }, 0)

  return totalPoint
}

function getWritableEvent(penaltyItem): WritablePenalty | undefined {
  return penaltyItem.events.find((event) => WRITABLE_PENALTIES.includes(event)) as WritablePenalty | undefined
}
