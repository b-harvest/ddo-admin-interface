import Button from 'components/Button'
import CopyHelper from 'components/CopyHelper'
import IconButton from 'components/IconButton'
import Tooltip from 'components/Tooltip'
import { REF_LINKED_PENALTIES } from 'constants/lsv'
import { FIELD_CSS } from 'constants/style'
import { TIMESTAMP_TO_MIN_FORMAT } from 'constants/time'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { Penalty, PENALTY_STATUS } from 'types/lsv'
import { extractEmailId, firstCharToUpperCase } from 'utils/text'

import LSVPenaltyIcon from './LSVPenaltyIcon'
import LSVPenaltyMetaData from './LSVPenaltyMetaData'

const DISCARDED_FONT_CSS = '!text-grayCRE-300 dark:!text-grayCRE-400'

type LSVPenaltyItemProps = {
  penalty: Penalty
  showConfirmButton?: boolean
  onConfirmClick?: () => void
  proposalId?: number
  direction?: 'column' | 'row'
  hideField?: boolean
}

export default function LSVPenaltyItem({
  penalty,
  showConfirmButton = false,
  onConfirmClick,
  proposalId,
  direction = 'column',
  hideField = false,
}: LSVPenaltyItemProps) {
  const isRow = useMemo<boolean>(() => direction === 'row', [direction])
  const isDiscarded = useMemo<boolean>(() => penalty.status === PENALTY_STATUS.Discarded, [penalty])
  const dataHeightCSS = useMemo<string>(() => (showConfirmButton ? 'h-10 flex items-center ' : ''), [showConfirmButton])

  return (
    <div
      className={`flex flex-col justify-between items-stretch gap-y-2 ${
        isRow ? 'md:flex-row md:items-end md:gap-x-4' : ''
      } ${isDiscarded ? DISCARDED_FONT_CSS : ''}`}
    >
      <ul className={`grow shrink flex flex-col justify-between gap-x-4 gap-y-2 ${isRow ? 'md:flex-row' : ''}`}>
        <div className={`grow shrink flex flex-col gap-x-4 gap-y-2 ${isRow ? 'md:flex-row' : ''}`}>
          <ModularData
            field="Proposal #"
            hideField={hideField}
            data={penalty.rawJson?.proposalId === 0 ? '-' : penalty.rawJson?.proposalId}
            type="number"
            className={isRow ? `md:grow-0 md:shrink-0 md:basis-[120px]` : ''}
            dataClassName={`${dataHeightCSS} ${penalty.rawJson?.proposalId === 0 ? FIELD_CSS : ''}`}
          />
          <ModularData
            field="Commission rate"
            hideField={hideField}
            data={penalty.rawJson?.commision ? (Number(penalty.rawJson.commision) * 100).toFixed(2) : undefined}
            type="rate"
            className={isRow ? `md:grow-0 md:shrink-0 md:basis-[120px]` : ''}
            dataClassName={dataHeightCSS}
          />
          <ModularData
            field="Commission changed date"
            hideField={hideField}
            data={
              penalty.rawJson?.chagned
                ? dayjs(penalty.rawJson.chagned * 1000).format(TIMESTAMP_TO_MIN_FORMAT)
                : undefined
            }
            type="date"
            className={isRow ? `md:grow-0 md:shrink-0 md:basis-[160px]` : ''}
            dataClassName={dataHeightCSS}
          />
          <ModularData
            field="Block missing rate"
            hideField={hideField}
            data={penalty.rawJson?.percentage ? (Number(penalty.rawJson.percentage) * 100).toFixed(2) : undefined}
            type="rate"
            className={isRow ? `md:grow-0 md:shrink-0 md:basis-[120px]` : ''}
            dataClassName={dataHeightCSS}
          />
          <ModularData
            field="Missed block"
            hideField={hideField}
            data={penalty.rawJson?.missing_block}
            type="number"
            className={isRow ? `md:grow-0 md:shrink-0 md:basis-[160px]` : ''}
            dataClassName={dataHeightCSS}
          />

          <ModularData
            field="Last signing height"
            hideField={hideField}
            data={penalty.rawJson?.last_height}
            type="number"
            className={isRow ? `md:grow-0 md:shrink-0 md:basis-[120px]` : ''}
            dataClassName={dataHeightCSS}
          />

          <ModularData
            field="Height"
            hideField={hideField}
            data={penalty.rawJson?.proposalId ? undefined : penalty.height}
            type="number"
            className={isRow ? `md:grow-0 md:shrink-0 md:basis-[120px]` : ''}
            dataClassName={dataHeightCSS}
          />

          <ModularData
            field="Reference"
            hideField={hideField}
            data={
              REF_LINKED_PENALTIES.includes(penalty.event) ? (
                <Tooltip content={penalty.rawJson?.link ?? undefined}>
                  <IconButton
                    type="copylink"
                    className={`w-6 h-6 ${penalty.rawJson?.link ? 'hover:text-info' : 'opacity-40 cursor-default'}`}
                    onClick={() => {
                      if (penalty.rawJson?.link) window.open(penalty.rawJson.link, '_blank')
                    }}
                  />
                </Tooltip>
              ) : undefined
            }
            className={isRow ? `md:grow-0 md:shrink-0 md:basis-[120px]` : ''}
            dataClassName={dataHeightCSS}
          />

          <ModularData
            field="Description"
            hideField={hideField}
            data={penalty.rawJson?.desc}
            className="grow shrink"
            dataClassName={dataHeightCSS}
          />

          {/* dataDesc content should be fixed by penalty item */}
          <ModularData
            field="Description"
            hideField={hideField}
            data={penalty.dataDesc}
            className="grow shrink"
            dataClassName={`${FIELD_CSS} !font-normal !text-[12px] ${dataHeightCSS}`}
          />
        </div>

        <div
          className={`flex flex-col gap-x-4 gap-y-2 ${
            isRow ? 'md:flex-row md:grow-0 md:shrink-0 md:basis-[356px]' : ''
          }`}
        >
          <ModularData
            field="Post date"
            hideField={hideField}
            data={dayjs(penalty.timestamp).format(TIMESTAMP_TO_MIN_FORMAT)}
            type="date"
            className={`${isRow ? 'md:grow-0 md:shrink-0 md:basis-[148px]' : ''}`}
            dataClassName={dataHeightCSS}
          />

          <ModularData
            field="Posted by"
            hideField={hideField}
            data={
              penalty.regId ? (
                <CopyHelper toCopy={penalty.regId} iconPosition="left">
                  {extractEmailId(penalty.regId)}
                </CopyHelper>
              ) : (
                <div className={FIELD_CSS}>auto</div>
              )
            }
            className={`${isRow ? 'md:grow-0 md:shrink-0 md:basis-[100px]' : ''}`}
            dataClassName={dataHeightCSS}
          />

          <ModularData
            field="Penalty"
            hideField={hideField}
            data={penalty.penaltyPoint}
            className={`${isRow ? 'md:grow-0 md:shrink-0 md:basis-[60px]' : ''}`}
            dataClassName={dataHeightCSS}
          />

          <ModularData
            field="Type"
            hideField={hideField}
            data={
              <Tooltip content={`${penalty.type} ${penalty.status}`}>
                <LSVPenaltyIcon penalty={penalty} ignoreDiscarded={false} />
              </Tooltip>
            }
            className={isRow ? `md:grow-0 md:shrink-0 md:basis-[48px]` : ''}
            dataClassName={`h-6 flex items-center ${dataHeightCSS}`}
          />
        </div>
      </ul>

      {showConfirmButton && (
        <div
          className={`${isRow ? `md:grow-0 md:shrink-0 md:basis-[120px] md:ml-8` : ''} ${
            isDiscarded ? 'opacity-40' : ''
          }`}
        >
          <Tooltip
            content={
              penalty.status !== PENALTY_STATUS.NotConfirmed ? <LSVPenaltyMetaData penalty={penalty} /> : undefined
            }
          >
            <Button
              size="sm"
              label={penalty.status === PENALTY_STATUS.NotConfirmed ? 'Confirm' : firstCharToUpperCase(penalty.status)}
              color={penalty.confirmId ? 'neutral' : 'primary'}
              disabled={penalty.status !== PENALTY_STATUS.NotConfirmed}
              isLoading={false}
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              onClick={onConfirmClick ?? (() => {})}
            />
          </Tooltip>
        </div>
      )}
    </div>
  )
}

function ModularData({
  field,
  hideField = false,
  data,
  className = '',
  dataClassName = '',
  type,
}: {
  field: string
  hideField?: boolean
  data: string | JSX.Element | number | undefined
  className?: string
  dataClassName?: string
  type?: 'date' | 'rate' | 'number'
}) {
  return (
    <>
      {data !== undefined ? (
        <li className={`${className} flex flex-col justify-center items-start overflow-hidden`}>
          {hideField || <div className={`!font-normal !text-xs ${FIELD_CSS} whitespace-pre`}>{field}</div>}
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
