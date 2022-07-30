import AppPage from 'components/AppPage'

import TopAccounts from './sections/TopAccounts'

export default function Accounts() {
  return (
    <AppPage className="space-y-20">
      <section className="mb-20">
        <TopAccounts />
      </section>
    </AppPage>
  )
}
