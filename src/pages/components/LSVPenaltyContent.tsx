import CopyHelper from 'components/CopyHelper'
import H4 from 'components/H4'
import PostMetaDataLine from 'components/PostMetaDataLine'
import { FIELD_CSS } from 'constants/style'
import { TIMESTAMP_TO_MIN_FORMAT } from 'constants/time'
import dayjs from 'dayjs'
import { LSVPenaltyItem } from 'pages/components/LSVPenaltyItems'
import { Penalty } from 'types/lsv'

export default function LSVPenaltyContent({
  title,
  proposalId,
  penalty,
}: {
  title: string
  proposalId?: number
  penalty: Penalty
}) {
  return (
    <>
      <section>
        <header className="flex justify-start items-center gap-2 mb-4">
          {/* <Icon type={PENALTY_TYPE_ICON_MAP[penalty.type]} className="TYPO-BODY-M" /> */}
          <H4 title={title} className="" />
        </header>

        <LSVPenaltyItem proposalId={proposalId} penalty={penalty} isLast={true} />

        <div className={`${FIELD_CSS} !font-normal w-full mt-4`}>
          <PostMetaDataLine
            field={penalty.confirmId ? 'Confirm date' : 'Post date'}
            value={dayjs(penalty.postTimestamp).format(TIMESTAMP_TO_MIN_FORMAT)}
          />
          <PostMetaDataLine
            field={penalty.confirmId ? 'Confirmed by' : 'Posted by'}
            value={
              penalty.posterId ? (
                <CopyHelper toCopy={penalty.posterId} iconPosition="left">
                  {penalty.posterId}
                </CopyHelper>
              ) : (
                'auto'
              )
            }
          />
          {penalty.confirmId ? (
            <PostMetaDataLine field="Comment" value={penalty.confirmMsg.length ? penalty.confirmMsg : '-'} />
          ) : null}
        </div>
      </section>
    </>
  )
}
