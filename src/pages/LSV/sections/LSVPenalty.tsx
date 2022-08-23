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
import { TIMESTAMP_FORMAT } from 'constants/time'
import dayjs from 'dayjs'
// import TableList from 'components/TableList'
import useLSVEvent from 'hooks/useLSVEvent'
import { useState } from 'react'
import type { LSVEvent, LSVEventType, LSVPenaltyConfirmPost, LSVPenaltyWarnPost } from 'types/lsv'
import { openExplorerByHeight } from 'utils/browser'

const FIELD_CSS = 'TYPO-BODY-S text-grayCRE-400 dark:text-grayCRE-300 !font-medium'
const MANUAL_LSV_EVENTS: LSVEventType[] = ['reliabiity_warning', 'vote_warning', 'reliability_penalty', 'vote_penalty']
type PenaltyValueType = 'percentage' | 'string' | 'number' | 'desc'

export default function LSVPenalty({ address }: { address: string }) {
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

  const [modalSelected, setModalSelected] = useState<'Reliability' | 'Engagement'>('Reliability')

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
      <div className="flex flex-col md:flex-row justify-start items-center gap-4 mt-8 mb-8">
        <H3 title="Immediate Kickout / 3SO" className="" />
        <div className="grow-0 shrink-0 basis-[10%] px-4">
          <Button size="xs" label="+ Warn" onClick={onWarnClick} isLoading={isModalLoading} />
        </div>
      </div>

      <section className="space-y-1 mb-10">
        <div className={`hidden md:flex flex-row justify-between items-stretch gap-1 ${FIELD_CSS}`}>
          <div className="grow-0 shrink-0 basis-auto md:basis-[14%] px-4">Observation item</div>
          <div className="grow-0 shrink-0 basis-auto md:basis-[10%] px-4 text-center">Height</div>
          <div className="grow shrink basis-auto w-full px-4">Details</div>
          <div className="grow-0 shrink-0 basis-auto md:basis-[14%] px-4 flex gap-2 items-center">
            <span>By</span>{' '}
            <QuestionTooltip desc={`Who registered/confirmed the penalty,\n@crescent.foundation elliptical`} />
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
              desc="Jail time has ever changed out of 0"
              events={evtsJailed}
              valueKeys={[{ key: 'jailUntilTimestamp', type: 'number' }]}
            />
            <ValPenaltySection
              title="Commission"
              desc={`Over a week since named as LSV, \nthe validator has ever had commision rate ≠ 20%`}
              events={evtsCommissionChanged}
              valueKeys={[{ key: 'commision', alias: 'Commission rate', type: 'percentage' }]}
            />
            <ValPenaltySection
              title="Stability"
              desc={`Over 10% of 30,000 blocks missed`}
              events={evtsBlockMissing}
              valueKeys={[{ key: 'percentage', alias: 'Block missing', type: 'percentage' }]}
            />
            <ValPenaltySection
              title="Sustainability"
              desc={`Been over 6 hours since last block-signing`}
              events={evtsNoSigning}
              valueKeys={[{ key: 'last_height', alias: 'Last signing height', type: 'number' }]}
            />
            <ValPenaltySection
              title="Performance"
              desc={`The sum of latest 50 blocks' txs comes ≤ 5`}
              events={evtsBadPerformance}
              valueKeys={[]}
            />
            <ValPenaltySection
              title="Reliability"
              desc={`1-striked when meets 2 items out of the following\n• Binary upgrade in 3 hours\n• Emergency response in 12 hours\n• Node config upgrade in 24 hours`}
              events={evtsReliabilityWarn.concat(evtsReliabilityPenalty)}
              valueKeys={[{ key: 'desc', alias: '', type: 'desc' }]}
            />

            <ValPenaltySection
              title="Engagement"
              desc={`1-striked when comes under one of the following\n• Been warned but still does not vote\n• Voting rate is < 50%\n• Has abstained habitually`}
              events={evtsVoteWarn.concat(evtsVotePenalty)}
              valueKeys={[{ key: 'desc', alias: '', type: 'desc' }]}
            />
          </>
        )}
      </section>

      <Modal active={modal} onClose={onClose} onOk={onWarn} okButtonLabel="Warn" isLoading={isModalLoading}>
        <H4 title="Give warning" className="mb-4" />
        <div className="space-y-4">
          <SelectTab
            tabItems={[
              { label: 'Reliability', value: 'Reliability' },
              { label: 'Engagement', value: 'Engagement' },
            ]}
            selectedValue={modalSelected}
            onChange={setModalSelected}
          />
          {modalSelected === 'Engagement' && (
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

  return (
    <>
      {events.length ? (
        <>
          <div className="flex flex-col items-stretch gap-1">
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

          <Modal active={modal} onClose={onClose} onOk={onConfirm} onNo={onDiscard} isLoading={isModalLoading}>
            <H4 title="Confirm penalty or discard" className="mb-4" />
            <div className="space-y-4">
              <div className="flex justify-start items-center gap-2">
                <span className={FIELD_CSS}>Penalty point {events[0].penaltyPoint}</span>
                {events[0].penaltyPoint === 3 ? (
                  <Tag status="error">Immediate kickout</Tag>
                ) : (
                  <Tag status="warning">1 Strike</Tag>
                )}
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

  type LSVPenaltyType = 'warning' | 'penalty'
  const isManual = MANUAL_LSV_EVENTS.includes(event.event)
  const type = (isManual ? event.event.split('_')[1] : 'warning') as LSVPenaltyType
  const typeCSS = type === 'warning' ? 'text-warning' : 'text-error'

  const regId = event.regId
  const confirmId = event.confirmId
  const confirmed = event.confirmResult === 'y'

  return (
    <div className="flex flex-col md:flex-row justify-between items-stretch gap-1">
      <Card useGlassEffect={true} className="rounded-md grow-0 shrink-0 basis-auto md:basis-[14%] flex justify-center">
        <div className="flex justify-start items-center gap-2">
          <div className={FIELD_CSS}>{title}</div>
          <QuestionTooltip desc={desc} />
        </div>
      </Card>

      <Card useGlassEffect={true} className="rounded-md grow-0 shrink-0 basis-auto md:basis-[10%] flex justify-center">
        <div
          className="TYPO-BODY-XS FONT-MONO text-center cursor-pointer"
          onClick={() => openExplorerByHeight(height.toString())}
        >
          {height}
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
        <div className="TYPO-BODY-S">
          <CopyHelper toCopy={getAdminId(confirmId ?? regId) === '-' ? '' : confirmId ?? regId} iconPosition="left">
            {' '}
            {getAdminId(confirmId ?? regId)}
          </CopyHelper>
        </div>
      </Card>

      <Card
        useGlassEffect={true}
        className="rounded-md grow-0 shrink-0 basis-auto md:basis-[12%] text-center flex justify-center"
      >
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
      </Card>

      <div className="grow-0 shrink-0 basis-auto md:basis-[10%] flex justify-center items-center px-4">
        <Button
          size="xs"
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
