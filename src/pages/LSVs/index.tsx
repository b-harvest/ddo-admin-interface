import AppPage from 'components/AppPage'
import CommonwealthLink from 'components/CommonwealthLink'
import ExplorerLink from 'components/ExplorerLink'
import H3 from 'components/H3'
import useLSV from 'hooks/useLSV'

import LSVList from './sections/LSVList'
import VotingTable from './sections/VotingTable'

export default function LSVs() {
  const { allLSVTimestamp, allLSV, isLoading } = useLSV()

  return (
    <AppPage>
      <section className="mt-20 mb-20">
        <div className="flex items-center justify-between gap-x-4 mb-4">
          <H3 title="All LSV" /> <ExplorerLink validator="all" />
        </div>

        <LSVList timestamp={allLSVTimestamp} list={allLSV} isLoading={isLoading} />
      </section>

      <section className="mb-20">
        <VotingTable timestamp={allLSVTimestamp} list={allLSV} isLoading={isLoading} />
      </section>

      <div className="flex justify-end items-center mt-4">
        <CommonwealthLink discussionId={5983} label="3 strike-out & immediate kick-out discussion" />
      </div>
    </AppPage>
  )
}
