import AppPage from 'components/AppPage'

import BalancesListSection from './sections/BalancesListSection'
//import OperatingAccounts from './sections/OperatingAccounts'

export default function Balances() {
  return (
    <AppPage className="space-y-20">
            <section className="mb-20">
        <BalancesListSection />
      </section>
      {/* <section className="mb-20">
        <OperatingAccounts />
      </section> */}
    </AppPage>
  )
}
