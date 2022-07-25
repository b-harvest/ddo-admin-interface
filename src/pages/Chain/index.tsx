import AppPage from 'components/AppPage'
import Card from 'components/Card'
import useChain from 'hooks/useChain'

// import { useAtom } from 'jotai'
// import { latestBlockLCDAtomRef } from 'state/atoms'
import BlockChart from './sections/BlockChart'
import CreAlertTimeline from './sections/CreAlertTimeline'
import IBCVolume from './sections/IBCVolume'

export default function Chain() {
  // const [latestBlockLCDAtom] = useAtom(latestBlockLCDAtomRef)

  const { blockCreationTime } = useChain()

  return (
    <AppPage>
      <section className="text-black dark:text-white text-left mb-4">
        <Card useGlassEffect={true}>{blockCreationTime}</Card>
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
