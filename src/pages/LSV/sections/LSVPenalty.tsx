import BigNumber from 'bignumber.js'
import Button from 'components/Button'
import Card from 'components/Card'
import CopyHelper from 'components/CopyHelper'
import EmptyData from 'components/EmptyData'
import H3 from 'components/H3'
import H4 from 'components/H4'
import Input from 'components/Inputs/Input'
import Textarea from 'components/Inputs/Textarea'
import Modal from 'components/Modal'
import QuestionTooltip from 'components/QuestionTooltip'
import SelectTab from 'components/SelectTab'
import Tag from 'components/Tag'
import Tooltip from 'components/Tooltip'
import {
  LSV_OBSERVATION_DESC_COMMISSION,
  LSV_OBSERVATION_DESC_ENGAGEMENT,
  LSV_OBSERVATION_DESC_JAILED,
  LSV_OBSERVATION_DESC_PERFORMANCE,
  LSV_OBSERVATION_DESC_RELIABILITY,
  LSV_OBSERVATION_DESC_STABILITY,
  LSV_OBSERVATION_DESC_SUSTAINABILITY,
} from 'constants/msg'
import { TIMESTAMP_FORMAT } from 'constants/time'
import dayjs from 'dayjs'
// import TableList from 'components/TableList'
import useLSVEvent from 'hooks/useLSVEvent'
import { useMemo, useState } from 'react'
import type { LSVEvent, LSVEventType, LSVPenaltyConfirmPost, LSVPenaltyWarnPost } from 'types/lsv'
import { openExplorerByHeight } from 'utils/browser'
import { isMobile } from 'utils/userAgent'

const FIELD_CSS = 'TYPO-BODY-S text-grayCRE-400 dark:text-grayCRE-300 !font-medium'
const MANUAL_LSV_EVENTS: LSVEventType[] = ['reliabiity_warning', 'vote_warning', 'reliability_penalty', 'vote_penalty']
type PenaltyValueType = 'percentage' | 'string' | 'number' | 'desc'

const buttonSize = isMobile ? 'md' : 'xs'

export default function LSVPenalty({ address, penaltyPoint }: { address: string; penaltyPoint: number }) {
  // events
  const { getLSVEvents, isLoading } = useLSVEvent(address)
  const evtsCommissionChanged = getLSVEvents('commssion_changed')
  const evtsJailed = getLSVEvents('jailed')
  const evtsBlockMissing = getLSVEvents('block_missing')
  const evtsNoSigning = getLSVEvents('no_signing')
  const evtsBadPerformance = getLSVEvents('bad_performance')
  const evtsReliabilityWarn = getLSVEvents('reliabiity_warning')
  const evtsReliabilityPenalty = getLSVEvents('reliability_penalty')
  const evtsVoteWarn = getLSVEvents('vote_warning')
  const evtsVotePenalty = getLSVEvents('vote_penalty')

  const [modal, setModal] = useState<boolean>(false)
  const [isModalLoading, setIsModalLoading] = useState<boolean>(false)

  const [modalSelected, setModalSelected] = useState<'reliabiity_warning' | 'vote_warning'>('reliabiity_warning')

  const [modalProposalId, setModalProposalId] = useState<string>('')
  const [modalMemo, setModalMemo] = useState<string>('')

  const onClose = () => {
    setModal(false)
    setIsModalLoading(false)
  }

  const onWarn = () => {
    setIsModalLoading(true)
    const postData: LSVPenaltyWarnPost = {
      addr: address,
      desc: modalMemo,
      proposalId: Number(modalProposalId) ?? undefined,
    }
  }

  const onWarnClick = () => {
    setModal(true)
  }

  return (
    <>
      {/* Immediate Kickout */}
      <div className="flex flex-col md:flex-row justify-start md:justify-between items-start gap-4 mt-8 mb-8">
        <div>
          <H3 title="Immediate Kickout / 3SO" className="" />
          <div className="mt-2">
            <span className="TYPO-BODY-S mr-2">Current penalty point</span>
            <span className={`FONT-MONO ${penaltyPoint >= 3 ? 'text-error' : ''}`}>{penaltyPoint}</span>
          </div>
        </div>
        <div className="w-full grow-0 shrink-0 basis-[10%] md:px-4">
          <Button
            size={buttonSize}
            color="primary-glow"
            label="+ Warning"
            onClick={onWarnClick}
            isLoading={isModalLoading}
          />
        </div>
      </div>

      <section className="space-y-4 md:space-y-1 mb-10">
        <div className={`hidden md:flex flex-row justify-between items-stretch gap-1 ${FIELD_CSS}`}>
          <div className="grow-0 shrink-0 basis-auto md:basis-[14%] px-4">Observation item</div>
          <div className="grow-0 shrink-0 basis-auto md:basis-[10%] px-4 text-center">Height</div>
          <div className="grow shrink basis-auto w-full px-4">Details</div>
          <div className="grow-0 shrink-0 basis-auto md:basis-[14%] px-4 flex gap-2 items-center">
            <span>By</span>{' '}
            <QuestionTooltip desc={`Who posted/confirmed the penalty,\n@crescent.foundation elliptical`} />
          </div>
          <div className="grow-0 shrink-0 basis-auto md:basis-[12%] px-4 text-center">Type</div>
          <div className="grow-0 shrink-0 basis-auto md:basis-[10%] px-4"></div>
        </div>

        {isLoading ? (
          <EmptyData isLoading={isLoading} />
        ) : (
          <>
            <ValPenaltySection
              title="Jailed"
              desc={LSV_OBSERVATION_DESC_JAILED}
              events={evtsJailed}
              valueKeys={[{ key: 'jailUntilTimestamp', type: 'number' }]}
            />
            <ValPenaltySection
              title="Commission"
              desc={LSV_OBSERVATION_DESC_COMMISSION}
              events={evtsCommissionChanged}
              valueKeys={[{ key: 'commision', alias: 'Commission rate', type: 'percentage' }]}
            />
            <ValPenaltySection
              title="Stability"
              desc={LSV_OBSERVATION_DESC_STABILITY}
              events={evtsBlockMissing}
              valueKeys={[{ key: 'percentage', alias: 'Block missing', type: 'percentage' }]}
            />
            <ValPenaltySection
              title="Sustainability"
              desc={LSV_OBSERVATION_DESC_SUSTAINABILITY}
              events={evtsNoSigning}
              valueKeys={[{ key: 'last_height', alias: 'Last signing height', type: 'number' }]}
            />
            <ValPenaltySection
              title="Performance"
              desc={LSV_OBSERVATION_DESC_PERFORMANCE}
              events={evtsBadPerformance}
              valueKeys={[]}
            />
            <ValPenaltySection
              title="Reliability"
              desc={LSV_OBSERVATION_DESC_RELIABILITY}
              events={evtsReliabilityWarn.concat(evtsReliabilityPenalty)}
              valueKeys={[{ key: 'desc', alias: '', type: 'desc' }]}
            />

            <ValPenaltySection
              title="Engagement"
              desc={LSV_OBSERVATION_DESC_ENGAGEMENT}
              events={evtsVoteWarn.concat(evtsVotePenalty)}
              valueKeys={[{ key: 'desc', alias: '', type: 'desc' }]}
            />
          </>
        )}
      </section>

      <Modal active={modal} onClose={onClose} onOk={onWarn} okButtonLabel="Post warning" isLoading={isModalLoading}>
        <H4 title="Select the item warned about" className="mb-4" />
        <div className="space-y-4">
          <SelectTab
            tabItems={[
              { label: 'Reliability', value: 'reliabiity_warning' },
              { label: 'Engagement', value: 'vote_warning' },
            ]}
            selectedValue={modalSelected}
            onChange={setModalSelected}
          />
          <div className={`${FIELD_CSS} whitespace-pre-line`}>
            {modalSelected === 'vote_warning' ? LSV_OBSERVATION_DESC_ENGAGEMENT : LSV_OBSERVATION_DESC_RELIABILITY}
          </div>
          {modalSelected === 'vote_warning' && (
            <Input type="number" placeholder="Proposal ID" keyword={modalProposalId} onChange={setModalProposalId} />
          )}
          <Textarea placeholder="Describe warning" keyword={modalMemo} onChange={setModalMemo} />
        </div>
      </Modal>
    </>
  )
}

function ValPenaltySection({
  events,
  title,
  cardTitle,
  desc,
  valueKeys,
  postable,
}: {
  events: LSVEvent[]
  title: string
  cardTitle?: string
  desc: string
  valueKeys: { key: string; type: PenaltyValueType; alias?: string }[]
  postable?: boolean
}) {
  const [modal, setModal] = useState<boolean>(false)
  const [isModalLoading, setIsModalLoading] = useState<boolean>(false)

  const [modalMemo, setModalMemo] = useState<string>('')

  const onClose = () => {
    setModal(false)
    setIsModalLoading(false)
  }

  const onConfirm = () => {
    setIsModalLoading(true)
    const postData: LSVPenaltyConfirmPost = {
      eid: events[0].eid,
      msg: modalMemo,
      result: 'y',
    }
  }

  const onDiscard = () => {
    setIsModalLoading(true)
    const postData: LSVPenaltyConfirmPost = {
      eid: events[0].eid,
      msg: modalMemo,
      result: 'd',
    }
  }

  const penaltyPointAfterConfirm = useMemo<number>(
    () => (events[0] ? getPenaltyPointAfterConfirm(events[0]) : 0),
    [events]
  )

  return (
    <>
      {events.length ? (
        <>
          <div className="flex flex-col items-stretch gap-4 md:gap-1">
            {events.map((event) => (
              <ValPenaltyCard
                key={event.eid}
                title={title}
                desc={desc}
                event={event}
                valueKeys={valueKeys}
                onButtonClick={() => setModal(true)}
              />
            ))}
          </div>

          <Modal
            active={modal}
            onClose={onClose}
            onOk={onConfirm}
            onNo={onDiscard}
            isLoading={isModalLoading}
            okButtonLabel="Confirm penalty"
          >
            <H4 title="Confirm penalty or discard" className="mb-2" />
            <div className="space-y-4">
              <div className="space-y-2">
                <span className={FIELD_CSS}>When confirmed, the LSV will get penalty +{penaltyPointAfterConfirm}.</span>
                {getTagByPenaltyPoint(penaltyPointAfterConfirm)}
              </div>

              <Textarea placeholder="Memo" keyword={modalMemo} onChange={setModalMemo} />
            </div>
          </Modal>
        </>
      ) : null}
    </>
  )
  // <EmptyData label="NA" useGlassEffect={true} />
}

function getPenaltyPointAfterConfirm(event: LSVEvent): number {
  return event.event === 'vote_warning' ? 1 : event.penaltyPoint
}

function getTagByPenaltyPoint(point: number): JSX.Element | null {
  switch (point) {
    case 3:
      return <Tag status="error">Immediate kickout</Tag>
    case 1:
      return <Tag status="warning">1 Strike</Tag>
    case 0:
      return <Tag status="warning">To be monitored</Tag>
    default:
      return null
  }
}

function ValPenaltyCard({
  title,
  event,
  desc,
  valueKeys,
  buttonLabel = 'Confirm',
  onButtonClick,
}: {
  title: string
  desc: string
  event: LSVEvent
  valueKeys: { key: string; type: PenaltyValueType; alias?: string }[]
  error?: boolean
  warning?: boolean
  buttonLabel?: string
  onButtonClick: () => void
}) {
  const values = valueKeys.map((valueKey) => ({
    ...valueKey,
    value: event.rawJson?.[valueKey.key] ?? '☹',
  }))

  const height = event.height

  type LSVPenaltyType = 'Warning' | 'Strike' | 'Immediate kickout'
  const penaltyPointAfterConfirm = getPenaltyPointAfterConfirm(event)
  const type: LSVPenaltyType | undefined =
    penaltyPointAfterConfirm === 3
      ? 'Immediate kickout'
      : penaltyPointAfterConfirm === 0
      ? 'Warning'
      : penaltyPointAfterConfirm === 1
      ? 'Strike'
      : undefined
  const typeCSS = type === 'Immediate kickout' ? 'text-error' : 'Strike' ? 'text-warning' : ''

  const regId = event.regId
  const confirmId = event.confirmId
  const by = confirmId ?? regId

  const confirmed = event.confirmResult === 'y'

  function ObservationItem() {
    return (
      <div className="flex justify-start items-center gap-2">
        <div className={FIELD_CSS}>{title}</div>
        <QuestionTooltip desc={desc} />
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row justify-between items-stretch gap-1">
      <div className={`py-2 block md:hidden`}>
        <ObservationItem />
      </div>
      <Card
        useGlassEffect={true}
        className="hidden md:flex rounded-md grow-0 shrink-0 basis-auto md:basis-[14%] justify-center"
      >
        <ObservationItem />
      </Card>

      <Card useGlassEffect={true} className="rounded-md grow-0 shrink-0 basis-auto md:basis-[10%] flex justify-center">
        <div
          className="flex justify-between items-center gap-2 md:block cursor-pointer"
          onClick={() => openExplorerByHeight(height.toString())}
        >
          <div className={`block md:hidden ${FIELD_CSS}`}>Height</div>
          <div className="TYPO-BODY-XS FONT-MONO text-center">{height}</div>
        </div>
      </Card>

      <Card useGlassEffect={true} className="rounded-md grow shirnk w-full">
        {values.map((value) => (
          <div key={value.value} className="w-full flex justify-between items-center gap-2">
            <div className={FIELD_CSS}>{value.alias ?? value.key}</div>
            <div className={`${getValueCSS(value.type)} text-left`}>{getValue(value.value, value.type)}</div>
          </div>
        ))}
      </Card>

      <Card useGlassEffect={true} className="rounded-md grow-0 shrink-0 basis-auto md:basis-[14%] flex justify-center">
        <div className="flex justify-between items-center gap-2 md:block">
          <div className={`block md:hidden ${FIELD_CSS}`}>By</div>
          <div className="TYPO-BODY-S">
            {by !== 'n' ? (
              <CopyHelper toCopy={getAdminId(by) === '-' ? '' : by} iconPosition="left">
                {' '}
                {getAdminId(by)}
              </CopyHelper>
            ) : (
              <span className={`TYPO-BODY-S !font-normal text-grayCRE-300 dark:text-grayCRE-400`}>Auto</span>
            )}
          </div>
        </div>
      </Card>

      <Card
        useGlassEffect={true}
        className="rounded-md grow-0 shrink-0 basis-auto md:basis-[12%] text-center flex justify-center"
      >
        <div className="flex justify-between items-center gap-2 md:block">
          <div className={`block md:hidden ${FIELD_CSS}`}>Type</div>
          <div className={`${typeCSS} TYPO-BODY-S`}>
            <Tooltip
              content={
                confirmed
                  ? `${event.confirmMsg.length ? event.confirmMsg : 'No memo'}\nConfirmed ${dayjs(
                      event.confirmTimestamp
                    ).format(TIMESTAMP_FORMAT)}`
                  : ''
              }
            >
              {type}
            </Tooltip>
          </div>
        </div>
      </Card>

      <div className="grow-0 shrink-0 basis-auto md:basis-[10%] flex justify-center items-center md:px-4 mt-3 md:mt-0">
        <Button
          size={buttonSize}
          color={confirmed ? 'neutral' : 'primary'}
          label={confirmed ? 'Confirmed' : 'Manage'}
          disabled={confirmed}
          isLoading={false}
          onClick={onButtonClick}
        />
      </div>
    </div>
  )
}

function getAdminId(id: string): string {
  if (id === 'n') return '-'
  const adminId = id.split('@')[0] ?? id
  return adminId
}

function getValueCSS(type: PenaltyValueType): string {
  switch (type) {
    case 'percentage':
      return `FONT-MONO TYPO-BODY-S`
    case 'number':
      return `FONT-MONO TYPO-BODY-S`
    case 'string':
      return `TYPO-BODY-S`
    case 'desc':
      return `text-left TYPO-BODY-S w-full`
    default:
      return `TYPO-BODY-S`
  }
}

function getValue(value: any, type: PenaltyValueType): string {
  if (value !== 0 && !value) return '-'

  switch (type) {
    case 'percentage':
      return `${new BigNumber(value * 100).dp(2).toFormat()}%`
    case 'number':
      return value
    case 'string':
      return value
    default:
      return value
  }
}
