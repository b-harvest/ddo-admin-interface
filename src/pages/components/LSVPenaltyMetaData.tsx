import CopyHelper from 'components/CopyHelper'
import PostMetaDataLine from 'components/PostMetaDataLine'
import { TIMESTAMP_TO_MIN_FORMAT } from 'constants/time'
import dayjs from 'dayjs'
import { Penalty, PENALTY_STATUS } from 'types/lsv'
import { extractEmailId } from 'utils/text'

export default function LSVPenaltyMetaData({ penalty }: { penalty: Penalty }) {
  return (
    <>
      {penalty.status !== PENALTY_STATUS.NotConfirmed ? (
        <div className={`flex flex-col justify-start items-stretch`}>
          <PostMetaDataLine
            field={penalty.status === PENALTY_STATUS.Confirmed ? 'Confirm date' : 'Discard date'}
            value={dayjs(penalty.confirmTimestamp).format(TIMESTAMP_TO_MIN_FORMAT)}
          />

          <PostMetaDataLine
            field={penalty.status === PENALTY_STATUS.Confirmed ? 'Confirmed by' : 'Discarded by'}
            value={
              <CopyHelper toCopy={penalty.confirmId ?? ''} iconPosition="left">
                {penalty.confirmId ? extractEmailId(penalty.confirmId) : 'auto'}
              </CopyHelper>
            }
          />

          <PostMetaDataLine field="Comment" value={penalty.confirmMsg.length ? penalty.confirmMsg : '-'} />
        </div>
      ) : null}
    </>
  )
}
