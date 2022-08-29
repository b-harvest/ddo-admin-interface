import CopyHelper from 'components/CopyHelper'
import H4 from 'components/H4'
import Icon from 'components/Icon'
import IconButton from 'components/IconButton'
import PostMetaDataLine from 'components/PostMetaDataLine'
import { WARNING_STATUS_ICON_TYPE_MAP, WARNING_STATUS_VOTE_DESC_MAP } from 'constants/lsv'
import { FIELD_CSS } from 'constants/style'
import { TIMESTAMP_FORMAT } from 'constants/time'
import dayjs from 'dayjs'
import { VotePenalty } from 'types/lsv'

const PENALTY_WRAPPER_CSS = `flex justify-between items-stretch gap-4`
const PENALTY_FIELD_CSS = `grow-0 shrink-0 basis-[40%] ${FIELD_CSS}`
const PENALTY_VALUE_CSS = `grow shrink whitespace-pre-line`

export default function LSVWarningContent({
  title,
  proposalId,
  penalty,
}: {
  title: string
  proposalId: number
  penalty: VotePenalty
}) {
  return (
    <>
      <section>
        <header className="flex justify-start items-center gap-2 mb-4">
          <Icon type={WARNING_STATUS_ICON_TYPE_MAP[penalty.status]} className="TYPO-BODY-M" />
          <H4 title={title} className="" />
        </header>

        <div className="space-y-6 TYPO-BODY-M md:TYPO-BODY-S">
          <div className="space-y-1 border-t border-b border-grayCRE-400-o dark:border-grayCRE-300-o px-3 py-3">
            <div className={PENALTY_WRAPPER_CSS}>
              <div className={PENALTY_FIELD_CSS}>Status</div>
              <div className={PENALTY_VALUE_CSS}>
                <div className="flex items-center gap-2">
                  {/* <Icon type={WARNING_STATUS_ICON_TYPE_MAP[penalty.status]} className="TYPO-BODY-S" />{' '} */}
                  {WARNING_STATUS_VOTE_DESC_MAP[penalty.status]}
                </div>
              </div>
            </div>

            <div className={PENALTY_WRAPPER_CSS}>
              <div className={PENALTY_FIELD_CSS}>Penalty point</div>
              <div className={PENALTY_VALUE_CSS}>{penalty.penaltyPoint}</div>
            </div>

            <div className={PENALTY_WRAPPER_CSS}>
              <div className={PENALTY_FIELD_CSS}>Proposal #</div>
              <div className={PENALTY_VALUE_CSS}>{proposalId}</div>
            </div>

            <div className={PENALTY_WRAPPER_CSS}>
              <div className={PENALTY_FIELD_CSS}>Memo</div>
              <div className={`${PENALTY_VALUE_CSS} ${penalty.desc ? '' : 'opacity-40'}`}>
                {penalty.desc && penalty.desc.length ? penalty.desc : '-'}
              </div>
            </div>

            <div className={PENALTY_WRAPPER_CSS}>
              <div className={PENALTY_FIELD_CSS}>Reference</div>
              <div className={`${PENALTY_VALUE_CSS} TYPO-BODY-L`}>
                <IconButton
                  type="copylink"
                  className={penalty.refLink ? 'hover:text-info' : 'opacity-40 cursor-not-allowed'}
                  onClick={() => {
                    if (penalty.refLink) window.open(penalty.refLink, '_blank')
                  }}
                />
              </div>
            </div>
          </div>

          <div className={`${FIELD_CSS} !font-normal w-full`}>
            <PostMetaDataLine
              field={penalty.confirmId ? 'Confirm date' : 'Post date'}
              value={dayjs(penalty.postTimestamp).format(TIMESTAMP_FORMAT)}
            />
            <PostMetaDataLine
              field={penalty.confirmId ? 'Confirmed by' : 'Posted by'}
              value={
                penalty.posterId ? (
                  <CopyHelper toCopy={penalty.posterId} iconPosition="left">
                    {penalty.posterId}
                  </CopyHelper>
                ) : (
                  'back-end'
                )
              }
            />
            {penalty.confirmId ? (
              <PostMetaDataLine field="Comment" value={penalty.confirmMsg.length ? penalty.confirmMsg : '-'} />
            ) : null}
          </div>
        </div>
      </section>
    </>
  )
}
