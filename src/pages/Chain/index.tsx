import AppPage from 'components/AppPage'
import GlowBackground from 'components/GlowBackground'

// import { useAtom } from 'jotai'
// import { chainIdAtomRef } from 'state/atoms'
// import { isTestnet } from 'utils/chain'
import BlockChart from './sections/BlockChart'
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

      <section className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 space-x-0 md:space-x-4 mb-8">
        <BlockChart />
        <IBCVolume />
      </section>
    </AppPage>
  )
}
