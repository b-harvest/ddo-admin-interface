import H4 from 'components/H4'
import LSVPenaltyItem from 'pages/components/LSVPenaltyItem'
import { Penalty, PENALTY_STATUS } from 'types/lsv'

import LSVPenaltyMetaData from './LSVPenaltyMetaData'

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
          <H4 title={title} className="" />
        </header>

        <LSVPenaltyItem proposalId={proposalId} penalty={penalty} isLast={true} defaultExpanded={true} />

        {penalty.status !== PENALTY_STATUS.NotConfirmed ? (
          <div className="mt-4 pt-4 border-t border-grayCRE-200 dark:border-grayCRE-500">
            <LSVPenaltyMetaData penalty={penalty} />
          </div>
        ) : null}
      </section>
    </>
  )
}
