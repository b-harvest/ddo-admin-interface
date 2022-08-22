import Button from 'components/Button'
import Card from 'components/Card'
import CopyHelper from 'components/CopyHelper'
import EmptyData from 'components/EmptyData'
import H3 from 'components/H3'
import H4 from 'components/H4'
import Icon from 'components/Icon'
import Indicator from 'components/Indicator'
// import TableList from 'components/TableList'
import Tooltip from 'components/Tooltip'
import useLSVEvent from 'hooks/useLSVEvent'
import { useState } from 'react'
import type { LSVEventRaw } from 'types/lsv'
import { openExplorerByHeight } from 'utils/browser'

export default function LSVPenalty({ address }: { address: string }) {
  // events
  const { getLSVEvents } = useLSVEvent(address)
  const evtsCommissionChanged = getLSVEvents('commssion_changed')
  const evtsJailed = getLSVEvents('jailed')
  const evtsBlockMissing = getLSVEvents('block_missing')
  const evtsNoSigning = getLSVEvents('no_signing')
  const evtsBadPerformance = getLSVEvents('bad_performance')
  const evtsReliabilityWarn = getLSVEvents('reliabiity_warning')
  const evtsReliabilityPenalty = getLSVEvents('reliability_penalty')
  const evtsVoteWarn = getLSVEvents('vote_warning')
  const evtsVotePenalty = getLSVEvents('vote_penalty')

  return (
    <>
      {/* Immediate Kickout */}
      <section>
        <H3 title="Immediate Kickout" className="mt-8 mb-4" />

        <ValPenaltySection
          title="Jailed"
          desc="Jail time has ever changed out of 0"
          cardTitle="Jail time"
          events={evtsJailed}
          valueKey="jailUntilTimestamp"
        />
        <ValPenaltySection
          title="Commission"
          desc={`Over a week since named as LSV, \nthe validator has ever had commision rate ≠ 20%`}
          cardTitle="Commission rate(%)"
          events={evtsCommissionChanged}
          valueKey="commision"
        />
      </section>

      {/* 3SO */}
      <section>
        <H3 title="3SO" className="mt-8 mb-4" />

        <ValPenaltySection
          title="Stability"
          desc={`Over 10% of 30,000 blocks missed`}
          cardTitle="missed blocks (%)"
          events={evtsBlockMissing}
          valueKey="percentage"
        />
        <ValPenaltySection
          title="Sustainability"
          desc={`Been over 6 hours since last block-signing`}
          cardTitle="Last block height"
          events={evtsNoSigning}
          valueKey="last_height"
        />
        <ValPenaltySection
          title="Performance"
          desc={`The sum of latest 50 blocks' txs comes ≤ 5`}
          cardTitle="Bad performance"
          events={evtsBadPerformance}
          valueKey=""
        />
        <ValPenaltySection
          title="Reliability"
          desc={`1-striked when meets 2 items out of the following\n• Binary upgrade in 3 hours\n• Emergency response in 12 hours\n• Node config upgrade in 24 hours`}
          cardTitle="Description"
          events={evtsReliabilityWarn.concat(evtsReliabilityPenalty)}
          valueKey="desc"
          postable={true}
        />
        <ValPenaltySection
          title="Engagement"
          desc={`1-striked when comes under one of the following\n• Been warned but still does not vote\n• Voting rate is < 50%\n• Has abstained habitually`}
          cardTitle="Description"
          events={evtsVoteWarn.concat(evtsVotePenalty)}
          valueKey="desc"
          postable={true}
        />
      </section>
    </>
  )
}

function ValPenaltySection({
  events,
  title,
  cardTitle,
  desc,
  valueKey,
  postable,
}: {
  events: LSVEventRaw[]
  title: string
  cardTitle: string
  desc: string
  valueKey: string
  postable?: boolean
}) {
  const handlePostWarn = () => {
    console.log('warn clicked')
  }

  // const tableList = useMemo(() => {
  //   return events.map((item) => ({
  //     ...item,
  //     ...(item.rawJson ?? {}),
  //     [valueKey]: item.rawJson?.[valueKey] ?? '✓',
  //     button: (
  //       <Button
  //         size="sm"
  //         color="danger"
  //         label={'Confirm'}
  //         disabled={false}
  //         isLoading={false}
  //         onClick={() => console.log('tmp')}
  //       />
  //     ),
  //   }))
  // }, [events, valueKey])

  return (
    <div className="flex flex-col items-stretch gap-4 mb-10">
      <div className="flex justify-start items-center gap-4">
        <div className="flex justify-start items-center gap-2">
          <H4 title={title} />
          <Tooltip content={desc}>
            <Icon type="question" className="text-grayCRE-300 hover:text-grayCRE-200 dark:hover:text-grayCRE-400" />
          </Tooltip>
        </div>
        {postable && (
          <div>
            <Button
              size="xs"
              color="tranparent"
              label={'→ Warn'}
              disabled={false}
              isLoading={false}
              onClick={handlePostWarn}
            />
          </div>
        )}
      </div>

      {/* {tableList.length ? (
        <TableList
          showTitle={false}
          useSearch={false}
          useNarrow={true}
          list={tableList}
          fields={[
            {
              label: 'Height',
              value: 'height',
              type: 'number',
              align: 'left',
            },
            {
              label: cardTitle,
              value: valueKey,
              type: 'html',
            },
            {
              label: '',
              value: 'button',
              type: 'html',
              align: 'right',
            },
          ]}
        />
      ) : (
        <EmptyData label="NA" useNarrow={true} />
      )} */}

      {events.length ? (
        events.map((event) => <ValPenaltyCard key={event.eid} title={cardTitle} event={event} valueKey={valueKey} />)
      ) : (
        <EmptyData label="NA" useGlassEffect={true} />
      )}
    </div>
  )
}

function ValPenaltyCard({
  title,
  event,
  valueKey,
  error,
  warning,
  buttonLabel = 'Confirm',
  onButtonClick = () => console.log('clicked'),
}: {
  title: string
  event: LSVEventRaw
  valueKey: string
  error?: boolean
  warning?: boolean
  buttonLabel?: string
  onButtonClick?: () => void
}) {
  const value = event.rawJson?.[valueKey] ?? '☹'
  const height = event.height
  const onHeightClick = (height: number) => {
    if (height) openExplorerByHeight(height.toString())
  }

  const confirmId = event.confirmId
  const regId = event.regId

  const confirmed = event.confirmResult === 'y'

  const [confirmTried, setConfirmTried] = useState<boolean>(false)
  const [discardTried, setDiscardTried] = useState<boolean>(false)

  const handleConfirm = () => {
    if (confirmTried) {
      setConfirmTried(false)
      if (onButtonClick) onButtonClick()
    } else {
      setConfirmTried(true)
    }
  }

  const handleDiscard = () => {
    if (discardTried) {
      setDiscardTried(false)
      if (onButtonClick) onButtonClick()
    } else {
      setDiscardTried(true)
    }
  }

  return (
    <Card useGlassEffect={true} className="grow shrink basis-auto md:basis-[33%]">
      <Indicator title={title} light={true} className="TYPO-BODY-L !font-bold">
        <div className="w-full flex flex-col md:flex-row items-start md:items-end gap-4">
          <div className="w-full grow shrink">
            <div className={`FONT-MONO text-left ${error ? 'text-error' : warning ? 'text-warning' : ''}`}>
              {value ?? '-'}
            </div>
            {height ? (
              <div className={`TYPO-BODY-S text-grayCRE-300 mt-1 cursor-pointer`} onClick={() => onHeightClick(height)}>
                height {height}
              </div>
            ) : null}
            {regId && regId !== 'n' ? (
              <div className={`TYPO-BODY-XS text-grayCRE-300 mt-1 cursor-pointer`}>
                <CopyHelper toCopy={regId} iconPosition="left">
                  <span className="text-grayCRE-200 dark:text-grayCRE-400 whitespace-pre">post by </span>
                  {regId}
                </CopyHelper>
              </div>
            ) : null}
            {confirmed && confirmId ? (
              <div className={`TYPO-BODY-XS text-grayCRE-300 mt-1 cursor-pointer`}>
                <CopyHelper toCopy={confirmId} iconPosition="left">
                  <span className="text-grayCRE-200 dark:text-grayCRE-400 whitespace-pre">confirmed by </span>{' '}
                  {confirmId}
                </CopyHelper>
              </div>
            ) : null}
          </div>
          {event ? (
            <div className="w-full flex justify-end">
              <div className="flex gap-2 w-max">
                {discardTried && (
                  <Button
                    size="sm"
                    color="neutral"
                    label={'Back'}
                    isLoading={false}
                    onClick={() => setDiscardTried(false)}
                  />
                )}
                {!confirmed && !confirmTried && (
                  <Button
                    size="sm"
                    color="neutral"
                    label={discardTried ? `Are you sure to discard warning?` : 'Discard'}
                    disabled={confirmed}
                    isLoading={false}
                    onClick={handleDiscard}
                  />
                )}
                {confirmTried && (
                  <Button
                    size="sm"
                    color="danger"
                    label={'Back'}
                    isLoading={false}
                    onClick={() => setConfirmTried(false)}
                  />
                )}
                {!discardTried && (
                  <Button
                    size="sm"
                    color="danger"
                    label={
                      confirmed
                        ? 'Confirmed'
                        : confirmTried
                        ? `Are you sure to give penalty +${event.penaltyPoint}?`
                        : buttonLabel
                    }
                    disabled={confirmed}
                    isLoading={false}
                    onClick={handleConfirm}
                  />
                )}
              </div>
            </div>
          ) : null}
        </div>
      </Indicator>
    </Card>
  )
}
