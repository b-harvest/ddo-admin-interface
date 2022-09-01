import Button from 'components/Button'
import CopyHelper from 'components/CopyHelper'
import Icon from 'components/Icon'
import IconButton from 'components/IconButton'
import Tooltip from 'components/Tooltip'
import { PENALTY_TYPE_COLOR_MAP, PENALTY_TYPE_ICON_MAP, REF_LINKED_PENALTIES } from 'constants/lsv'
import { FIELD_CSS } from 'constants/style'
import { TIMESTAMP_TO_MIN_FORMAT } from 'constants/time'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { Penalty, PENALTY_STATUS } from 'types/lsv'
import { extractEmailId, firstCharToUpperCase } from 'utils/text'

type LSVPenaltyItemProps = {
  penalty: Penalty
  isLast?: boolean
  showPostInfo?: boolean
  showConfirmButton?: boolean
  onConfirmClick?: () => void
  proposalId?: number
  direction?: 'column' | 'row'
}

export default function LSVPenaltyItem({
  penalty,
  isLast = false,
  showPostInfo = false,
  showConfirmButton = false,
  onConfirmClick,
  proposalId,
  direction = 'column',
}: LSVPenaltyItemProps) {
  const isRow = useMemo<boolean>(() => direction === 'row', [direction])

  return (
    <ul
      className={`flex flex-col justify-between items-stretch gap-x-4 gap-y-2 ${
        isRow ? 'md:flex-row' : ''
      } border-grayCRE-300 dark:border-grayCRE-500 ${isLast ? 'pb-0 border-b-0' : 'pb-4 md:pb-2 border-b'}`}
    >
      <div className={`grow shrink basis-auto flex flex-col gap-x-4 gap-y-2 ${isRow ? 'md:flex-row' : ''}`}>
        <ModularData
          field="Proposal #"
          data={penalty.rawJson?.proposalId === 0 ? undefined : penalty.rawJson?.proposalId}
          type="number"
          className={isRow ? `md:grow-0 md:shrink-0 md:basis-[60px]` : ''}
        />
        <ModularData
          field="Commission rate"
          data={penalty.rawJson?.commision ? (Number(penalty.rawJson.commision) * 100).toFixed(2) : undefined}
          type="rate"
          className={isRow ? `md:grow-0 md:shrink-0 md:basis-[120px]` : ''}
        />
        <ModularData
          field="Commission changed date"
          data={
            penalty.rawJson?.chagned ? dayjs(penalty.rawJson.chagned * 1000).format(TIMESTAMP_TO_MIN_FORMAT) : undefined
          }
          type="date"
          className={isRow ? `md:grow-0 md:shrink-0 md:basis-[160px]` : ''}
        />
        <ModularData
          field="Block missing rate"
          data={penalty.rawJson?.percentage ? (Number(penalty.rawJson.percentage) * 100).toFixed(2) : undefined}
          type="rate"
          className={isRow ? `md:grow-0 md:shrink-0 md:basis-[120px]` : ''}
        />
        <ModularData
          field="Missed block"
          data={penalty.rawJson?.missing_block}
          type="number"
          className={isRow ? `md:grow-0 md:shrink-0 md:basis-[160px]` : ''}
        />

        <ModularData
          field="Last signing height"
          data={penalty.rawJson?.last_height}
          type="number"
          className={isRow ? `md:grow-0 md:shrink-0 md:basis-[120px]` : ''}
        />

        <ModularData
          field="Height"
          data={penalty.rawJson?.proposalId ? undefined : penalty.height}
          type="number"
          className={isRow ? `md:grow-0 md:shrink-0 md:basis-[100px]` : ''}
        />

        <ModularData
          field="Reference"
          data={
            REF_LINKED_PENALTIES.includes(penalty.event) ? (
              // penalty.event === 'vote_warning' || penalty.event === 'vote_penalty'
              <IconButton
                type="copylink"
                className={`w-6 h-6 ${penalty.rawJson?.link ? 'hover:text-info' : 'opacity-40 cursor-not-allowed'}`}
                onClick={() => {
                  if (penalty.rawJson?.link) window.open(penalty.rawJson.link, '_blank')
                }}
              />
            ) : undefined
          }
          className={isRow ? `md:grow-0 md:shrink-0 md:basis-[100px]` : ''}
        />

        <ModularData field="Description" data={penalty.rawJson?.desc} className="grow shrink" />
        <ModularData
          field="Description"
          data={penalty.dataDesc}
          className="grow shrink"
          dataClassName={`${FIELD_CSS} !font-normal !text-[12px]`}
        />
      </div>

      {showPostInfo && (
        <div
          className={`${
            isRow ? 'md:grow-0 md:shrink-0 md:basis-[320px] md:flex-row' : ''
          } flex flex-col gap-x-4 gap-y-2`}
        >
          <ModularData
            field={penalty.status === PENALTY_STATUS.Confirmed ? 'Confirm date' : 'Post date'}
            data={dayjs(penalty.postTimestamp).format(TIMESTAMP_TO_MIN_FORMAT)}
            type="date"
            className={isRow ? `md:grow-0 md:shrink-0 md:basis-[160px]` : ''}
          />
          <ModularData
            field={penalty.status === PENALTY_STATUS.Confirmed ? 'Confirmed by' : 'Posted by'}
            data={
              penalty.posterId ? (
                <CopyHelper toCopy={penalty.posterId} iconPosition="left">
                  {extractEmailId(penalty.posterId)}
                </CopyHelper>
              ) : (
                <div className={`!font-normal !text-[12px] ${FIELD_CSS}`}>Auto</div>
              )
            }
            className="grow shrink"
          />
        </div>
      )}

      <div
        className={`${isRow ? 'md:grow-0 md:shrink-0 md:basis-[120px] md:flex-row' : ''} flex flex-col gap-x-4 gap-y-2`}
      >
        <ModularData
          field="Penalty"
          data={penalty.penaltyPoint}
          className={isRow ? `md:grow-0 md:shrink-0 md:basis-[60px]` : ''}
        />

        <ModularData
          field="Type"
          data={
            <Tooltip content={`${penalty.type} ${penalty.status}`}>
              <Icon type={PENALTY_TYPE_ICON_MAP[penalty.type]} />
            </Tooltip>
          }
          className={isRow ? `md:grow-0 md:shrink-0 md:basis-[48px]` : ''}
          dataClassName={`h-6 flex items-center ${getPenaltyColor(penalty)}`}
        />

        {/* <ModularData
          field="Status"
          data={
            <Tooltip content={penalty.status}>
              <Icon type={PENALTY_STATUS_ICON_MAP[penalty.status]} />
            </Tooltip>
          }
          className={isRow ? `md:grow-0 md:shrink-0 md:basis-[48px]` : ''}
          dataClassName={`h-6 flex items-center ${getPenaltyColor(penalty)}`}
        /> */}
      </div>

      {showConfirmButton && (
        <div className={`${isRow ? `md:grow-0 md:shrink-0 md:basis-[148px] md:pl-8` : ''}`}>
          <Button
            size="sm"
            label={penalty.status === PENALTY_STATUS.NotConfirmed ? 'Confirm' : firstCharToUpperCase(penalty.status)}
            color={penalty.confirmId ? 'neutral' : 'primary'}
            disabled={penalty.confirmId !== undefined}
            isLoading={false}
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onClick={onConfirmClick ?? (() => {})}
          />
        </div>
      )}
    </ul>
  )
}

function ModularData({
  field,
  data,
  className = '',
  dataClassName = '',
  type,
}: {
  field: string
  data: string | JSX.Element | number | undefined
  className?: string
  dataClassName?: string
  type?: 'date' | 'rate' | 'number'
}) {
  return (
    <>
      {data || data === 0 ? (
        <li className={`${className} flex flex-col justify-start items-start`}>
          <div className={`!font-normal !text-xs ${FIELD_CSS}`}>{field}</div>
          <div
            className={`${dataClassName} ${type === 'rate' || type === 'number' ? 'FONT-MONO' : ''} ${
              type === 'date' ? 'TYPO-BODY-S' : 'TYPO-BODY-M'
            }`}
          >
            {data}
            {type === 'rate' ? '%' : null}
          </div>
        </li>
      ) : null}
    </>
  )
}

function getPenaltyColor(penalty: Penalty) {
  return penalty.status === PENALTY_STATUS.Discarded
    ? 'text-grayCRE-300 dark:text-grayCRE-400'
    : PENALTY_TYPE_COLOR_MAP[penalty.type]
}
