import Card from 'components/Card'
import H3 from 'components/H3'
import Icon from 'components/Icon'
import IconButton from 'components/IconButton'
import Textarea from 'components/Inputs/Textarea'
import { PENALTY_STATUS, WARNING_STATUS_ICON_TYPE_MAP, WRITABLE_PENALTIES } from 'constants/lsv'
import { FIELD_CSS } from 'constants/style'
import { useCallback, useState } from 'react'
import { LSVEventType, Penalty } from 'types/lsv'

type PenaltyItem = { label: string; desc: string; events: LSVEventType[] }
const PENALTY_ITEMS: PenaltyItem[] = [
  {
    label: 'Commission',
    desc: `commission rate higher than 20% over 3 days totally(accumulative)`,
    events: ['commssion_changed'],
  },
  {
    label: 'Stability',
    desc: `Block missing percentage over 10% every week`,
    events: ['block_missing'],
  },
  {
    label: 'Sustainability',
    desc: `Take over 6-hours in succession without block signing`,
    events: ['no_signing'],
  },
  {
    label: 'Reliability',
    desc: `When validator meets 2 items out of 3\n• Binary upgrade in 3 hours (related to software)\n• Emergency response in 12 hours\n• Node config upgrade in 24 hours (related with local setting ex, block time control, node parameter)`,
    events: ['reliabiity_warning', 'reliability_penalty'],
  },
  {
    label: 'Engagement',
    desc: `When validator meets 1 item out of 3\n• When the validator does not participate in governance actively, Crescent foundation gives a warning. If the validator does not vote even validator gets a warning\n• If a specific validator’s voting rate is less than 50% since they join LSV\n• When specific validator votes ‘abstain’ habitually in succession`,
    events: ['vote_warning', 'vote_penalty'],
  },
  {
    label: 'Performance',
    desc: `When proposing Diff(the actual number of proposing blocks compared with voting power) is less than 90% with 2 months of data`,
    events: ['bad_performance'],
  },
  {
    label: 'Activity',
    desc: `When a specific validator’s Expected TX share(actual handled TX is divided by expected TX) is less than 50% with 2 months of data`,
    events: [],
  },
]

export default function LSVPenaltyBoard({ penalties, penaltyPoint }: { penalties: Penalty[]; penaltyPoint: number }) {
  const getPanaltiesByEvents = useCallback(
    (events: LSVEventType[]) => penalties.filter((penalty) => events.includes(penalty.event)),
    [penalties]
  )

  return (
    <div className="mb-10">
      <div className="py-8">
        <H3 title="Penalty Board" className="" />
        <div className="mt-2">
          <span className="TYPO-BODY-S mr-2">Current penalty point</span>
          <span className={`FONT-MONO ${penaltyPoint >= 3 ? 'text-error' : ''}`}>{penaltyPoint}</span>
        </div>
      </div>

      <div className="space-y-2">
        {PENALTY_ITEMS.map((item) => (
          // overflow-hidden max-h-[24px] hover:max-h-screen transition-all
          <Card key={item.label} useGlassEffect={true}>
            <div className="flex flex-col md:flex-row justify-between items-stretch gap-1">
              <PenaltyField title={item.label} desc={item.desc}></PenaltyField>

              <div
                className={`${FIELD_CSS} grow shrink w-full whitespace-pre-line px-4 mr-4 md:border-r border-grayCRE-300 dark:border-grayCRE-500`}
                style={{ wordBreak: 'keep-all' }}
              >
                {item.desc}
              </div>

              <PenaltyStatus penalties={getPanaltiesByEvents(item.events)} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

function PenaltyField({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="grow shrink md:grow-0 md:shrink-0 md:basis-[130px] flex justify-start items-start gap-2">
      <div className={FIELD_CSS}>{title}</div>
      {/* <QuestionTooltip desc={desc} /> */}
    </div>
  )
}

function PenaltyStatus({ penalties }: { penalties: Penalty[] }) {
  const isSafe = penalties.length === 0
  const isWritable =
    WRITABLE_PENALTIES.findIndex((item) => penalties.map((penalty) => penalty.event).includes(item)) > -1

  const [penaltyInput, setPenaltyInput] = useState<string>('')

  return (
    <div className="grow shrink md:grow-0 md:shrink-0 basis-[40%] flex justify-end items-center gap-4">
      <div className="grow shrink w-full h-full">
        {isWritable ? (
          <Textarea
            placeholder="Describe penalty"
            keyword={penaltyInput}
            onChange={setPenaltyInput}
            fillHeight={true}
          />
        ) : null}
      </div>
      <div className="grow-0 shrink-0 basis-auto flex justify-end px-4">
        {isSafe ? <Icon type="success" className="text-success" /> : PenaltyStatusIcon({ penalties })}
      </div>
    </div>
  )
}

function PenaltyStatusIcon({ penalties }: { penalties: Penalty[] }) {
  const onClick = () => {
    const shouldConfirm = penalties.find((penalty) =>
      [PENALTY_STATUS.Penalty, PENALTY_STATUS.Warned].includes(penalty.status)
    )
    if (shouldConfirm) {
      // show confirm modal
    }
  }

  return penalties.length > 0 ? (
    <IconButton type={WARNING_STATUS_ICON_TYPE_MAP[penalties[0].status]} className="text-warning" onClick={onClick} />
  ) : null
}
