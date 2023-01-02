import AppPage from 'components/AppPage'

import OperatingAccounts from './sections/OperatingAccounts'
// import TopAccounts from './sections/TopAccounts'

export default function Accounts() {
  return (
    <AppPage className="space-y-20">
      <section className="mb-20">
        <OperatingAccounts />
      </section>
    </AppPage>
  )
}
