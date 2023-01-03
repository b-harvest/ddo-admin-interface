import AppPage from 'components/AppPage'

import TxsListSection from './sections/TxsListSection'

export default function Txs() {
  return (
    <AppPage className="space-y-20">
      <section className="mb-20">
        <TxsListSection />
      </section>
    </AppPage>
  )
}
