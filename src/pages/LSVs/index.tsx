import AppPage from 'components/AppPage'
import Button from 'components/Button'
import CommonwealthLink from 'components/CommonwealthLink'
import ExplorerLink from 'components/ExplorerLink'
import H3 from 'components/H3'
import useLSV from 'hooks/useLSV'
import NewLSVPostModal from 'pages/components/NewLSVPostModal'
import { useState } from 'react'

import LSVList from './sections/LSVList'
import VotingTable from './sections/VotingTable'

export default function LSVs() {
  const { allLSVTimestamp, allLSV, isLoading, mutateAllLSV } = useLSV()

  const [addLSVModal, setAddLSVModal] = useState<boolean>(false)
  const onAddLSVModalClose = () => {
    mutateAllLSV()
    setAddLSVModal(false)
  }

  const onAddLSVClick = () => setAddLSVModal(true)

  return (
    <AppPage>
      <section className="mt-20 mb-20">
        <div className="flex items-center justify-between gap-x-4 mb-4">
          <H3 title="All LSV" /> <ExplorerLink validator="all" />
        </div>

        <LSVList timestamp={allLSVTimestamp} list={allLSV} isLoading={isLoading} />

        <div className="flex justify-end gap-2 mt-4">
          <div className="inline-block">
            <Button size="sm" label="Add LSV" isLoading={false} onClick={onAddLSVClick} />
          </div>
        </div>
      </section>

      <section className="mb-20">
        <VotingTable timestamp={allLSVTimestamp} list={allLSV} isLoading={isLoading} />
      </section>

      <div className="flex justify-end items-center mt-8">
        <CommonwealthLink discussionId={5983} label="3 strike-out & immediate kick-out discussion" />
      </div>

      <NewLSVPostModal active={addLSVModal} onClose={onAddLSVModalClose} />
    </AppPage>
  )
}
