import Card from 'components/Card'
import CopyHelper from 'components/CopyHelper'
import Icon from 'components/Icon'
import IconButton from 'components/IconButton'
import { WARNING_STATUS_ICON_TYPE_MAP } from 'constants/lsv'
import { LSV_VOTE_WARN_REFERENCE_SEPERATOR } from 'constants/msg'
import { FIELD_CSS } from 'constants/style'
import { TIMESTAMP_FORMAT } from 'constants/time'
import dayjs from 'dayjs'
import { Penalty } from 'types/lsv'
import { extractEmailId } from 'utils/text'

export default function LSVPenaltyItems({ penalties }: { penalties: Penalty[] }) {
  return (
    <>
      {penalties.length > 0 ? (
        <Card useGlassEffect={true} className="!bg-grayCRE-100 dark:!bg-neutral-700 flex flex-col gap-4">
          {penalties.map((penalty, i) => (
            <LSVPenaltyItem key={penalty.eid} penalty={penalty} isLast={i === penalties.length - 1} />
          ))}
        </Card>
      ) : null}
    </>
  )
}

function LSVPenaltyItem({ penalty, isLast = false }: { penalty: Penalty; isLast: boolean }) {
  const descs: string[] = penalty.rawJson?.desc?.split(LSV_VOTE_WARN_REFERENCE_SEPERATOR) ?? []
  const refLink = descs.length === 2 ? descs[0] : undefined
  const descRaw = descs[1] ?? penalty.rawJson?.desc
  const desc = descRaw?.length === 0 ? '-' : descRaw

  return (
    <ul
      className={`flex justify-between items-center gap-2 border-grayCRE-300 dark:border-grayCRE-500 ${
        isLast ? 'pb-0 border-b-0' : 'pb-4 border-b'
      }`}
    >
      <LSVPenaltyItemData field="Height" data={penalty.height} type="number" />

      <LSVPenaltyItemData
        field="Commission rate"
        data={penalty.rawJson?.commision ? Number(penalty.rawJson.commision) * 100 : undefined}
        type="rate"
      />
      <LSVPenaltyItemData
        field="Commission changed"
        data={penalty.rawJson?.chagned ? dayjs(penalty.rawJson.chagned * 1000).format(TIMESTAMP_FORMAT) : undefined}
        type="date"
      />
      <LSVPenaltyItemData
        field="Block missing rate"
        data={penalty.rawJson?.percentage ? Number(penalty.rawJson.percentage) * 100 : undefined}
        type="rate"
      />
      <LSVPenaltyItemData field="Missded block" data={penalty.rawJson?.missing_block} type="number" />

      <LSVPenaltyItemData field="Last signing height" data={penalty.rawJson?.last_height} type="number" />

      <LSVPenaltyItemData
        field="Reference"
        data={
          penalty.event === 'vote_warning' || penalty.event === 'vote_penalty' ? (
            <IconButton
              type="copylink"
              className={`w-6 h-6 ${refLink ? 'hover:text-info' : 'opacity-40 cursor-not-allowed'}`}
              onClick={() => {
                if (refLink) window.open(refLink, '_blank')
              }}
            />
          ) : undefined
        }
      />

      <LSVPenaltyItemData field="Memo" data={desc} />
      <LSVPenaltyItemData
        field={penalty.confirmId ? 'Confirm date' : 'Post date'}
        data={dayjs(penalty.postTimestamp).format(TIMESTAMP_FORMAT)}
        type="date"
      />
      <LSVPenaltyItemData
        field={penalty.confirmId ? 'Confirmed by' : 'Posted by'}
        data={
          penalty.posterId ? (
            <CopyHelper toCopy={penalty.posterId} iconPosition="left">
              {extractEmailId(penalty.posterId)}
            </CopyHelper>
          ) : (
            '-'
          )
        }
      />

      <LSVPenaltyItemData field="Penalty" data={penalty.penaltyPoint} />

      <div className="grow-0 shrink-0 basis-[100px] flex justify-end px-4 text-warning hover:opacity-80">
        {penalty.confirmId ? (
          <Icon type="slash" />
        ) : (
          <IconButton type={WARNING_STATUS_ICON_TYPE_MAP[penalty.status]} label="confirm" showLabel={true} />
        )}
      </div>
    </ul>
  )
}

function LSVPenaltyItemData({
  field,
  data,
  dataClassName = '',
  type,
}: {
  field: string
  data: string | JSX.Element | number | undefined
  dataClassName?: string
  type?: 'date' | 'rate' | 'number'
}) {
  return (
    <>
      {data !== undefined ? (
        <li className="flex flex-col justify-between items-start">
          <div className={`${FIELD_CSS} !font-normal !text-xs`}>{field}</div>
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
