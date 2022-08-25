import CopyHelper from 'components/CopyHelper'
import H4 from 'components/H4'
import Icon from 'components/Icon'
import IconButton from 'components/IconButton'
import { WARNING_STATUS_ICON_TYPE_MAP, WARNING_STATUS_VOTE_DESC_MAP } from 'constants/lsv'
import { FIELD_CSS } from 'constants/style'
import { TIMESTAMP_FORMAT } from 'constants/time'
import dayjs from 'dayjs'
import { VotePenalty } from 'types/lsv'

const PENALTY_FIELD_SIZE_CSS = `grow-0 shrink-0 basis-[40%] ${FIELD_CSS}`

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

        <div className="space-y-6">
          <div className="space-y-2 border-t border-b border-grayCRE-400-o dark:border-grayCRE-300-o px-3 py-3">
            <div className="flex justify-between items-center gap-4">
              <div className={PENALTY_FIELD_SIZE_CSS}>Status</div>
              <div className="grow shrink">
                <div className="flex items-center gap-2">
                  {/* <Icon type={WARNING_STATUS_ICON_TYPE_MAP[penalty.status]} className="TYPO-BODY-S" />{' '} */}
                  {WARNING_STATUS_VOTE_DESC_MAP[penalty.status]}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center gap-4">
              <div className={PENALTY_FIELD_SIZE_CSS}>Penalty point</div>
              <div className="grow shrink">{penalty.penaltyPoint}</div>
            </div>

            <div className="flex justify-between items-center gap-4">
              <div className={PENALTY_FIELD_SIZE_CSS}>Proposal #</div>
              <div className="grow shrink">{proposalId}</div>
            </div>

            <div className="flex justify-between items-center gap-4">
              <div className={PENALTY_FIELD_SIZE_CSS}>Memo</div>
              <div className={`grow shrink ${penalty.desc ? '' : 'opacity-40'}`}>{penalty.desc ?? '-'}</div>
            </div>

            <div className="flex justify-between items-center gap-4">
              <div className={PENALTY_FIELD_SIZE_CSS}>Reference</div>
              <div className="grow shrink TYPO-BODY-L">
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

          <div className={`${FIELD_CSS} !font-normal w-max`}>
            <div className="TYPO-BODY-XS">{dayjs(penalty.timestamp).format(TIMESTAMP_FORMAT)}</div>
            <div className="TYPO-BODY-XS">
              {penalty.confirmId ? 'Confirmed by' : 'Posted by'}
              {penalty.posterId ? (
                <CopyHelper toCopy={penalty.posterId} iconPosition="left">
                  {penalty.posterId}
                </CopyHelper>
              ) : (
                <div>back-end</div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
