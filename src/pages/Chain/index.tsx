import AppPage from 'components/AppPage'

import BlockChart from './sections/BlockChart'
import CreAlertTimeline from './sections/CreAlertTimeline'
import IBCNetwork from './sections/IBCNetwork'
import IBCVolume from './sections/IBCVolume'

export default function Chain() {
  return (
    <AppPage>
      <section className=" mb-4">
        <IBCNetwork />
      </section>

      <section className="flex flex-col justify-between items-stretch mb-20">
        <BlockChart />
      </section>

      <section className="flex flex-col md:flex-row items-stretch space-y-4 md:space-y-0 md:space-x-8 mb-20">
        <div className="shrink-0 grow-0 md:basis-[40%]">
          <IBCVolume />
        </div>
        <div className="shrink grow md:basis-[60%]">
          <CreAlertTimeline />
        </div>
      </section>
    </AppPage>
  )
}
