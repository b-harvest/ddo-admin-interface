import AppPage from 'components/AppPage'
import GlowBackground from 'components/GlowBackground'
import useChain from 'hooks/useChain'
import { useAtom } from 'jotai'
import BlockHeightPolling from 'pages/components/BlockHeightPolling'
import { chainIdAtomRef } from 'state/atoms'
import { isTestnet } from 'utils/chain'

import BlockChart from './sections/BlockChart'

export default function Chain() {
  const { findChainById } = useChain({})

  // chain
  const [chainIdAtom] = useAtom(chainIdAtomRef)
  const isOnTestnet = isTestnet(chainIdAtom)

  const { backendBlockHeight, onchainBlockHeight } = useChain({ interval: 5000 })

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

      <section className="mb-4">
        <BlockHeightPolling onchainBlockHeight={onchainBlockHeight} backendBlockHeight={backendBlockHeight} />
      </section>

      <section className="flex flex-col justify-between items-center space-y-4 mb-8 md:flex-row md:space-x-4 md:space-y-0">
        <BlockChart />
      </section>
    </AppPage>
  )
}
