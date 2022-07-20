import AppPage from 'components/AppPage'
import GlowBackground from 'components/GlowBackground'

// import { useAtom } from 'jotai'
// import { chainIdAtomRef } from 'state/atoms'
// import { isTestnet } from 'utils/chain'
import BlockChart from './sections/BlockChart'
import CreAlertTimeline from './sections/CreAlertTimeline'
import IBCVolume from './sections/IBCVolume'

export default function Chain() {
  // const { findChainById } = useChain({})

  // chain
  // const [chainIdAtom] = useAtom(chainIdAtomRef)
  // const isOnTestnet = isTestnet(chainIdAtom)

  return (
    <AppPage>
      <GlowBackground
        style={{
          transform: 'translateY(-150vh) translateX(-50vw)',
        }}
      />
      <GlowBackground
        style={{
          transform: 'translateY(25vh) translateX(75vw)',
        }}
      />

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
