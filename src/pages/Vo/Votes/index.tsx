import AppPage from 'components/AppPage'

import VoteListSection from './sections/VoteListSection'

export default function Txs() {
  return (
    <AppPage className="space-y-20">
      <section className="mb-20">
        <VoteListSection />
      </section>
    </AppPage>
  )
}
