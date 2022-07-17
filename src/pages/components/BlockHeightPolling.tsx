import Polling from 'components/Polling'
import { useMemo } from 'react'

export default function BlockHeightPolling({
  onchainBlockHeight,
  backendBlockHeight,
}: {
  onchainBlockHeight: string
  backendBlockHeight: string
}) {
  const blockPollingStatus = useMemo(
    () => (onchainBlockHeight === backendBlockHeight ? 'info' : 'warning'),
    [onchainBlockHeight, backendBlockHeight]
  )

  return (
    <div className="shrink-0 grow-0 flex flex-col md:flex-row justify-start items-start md:items-center space-y-1 md:space-y-0 space-x-0 md:space-x-4">
      <div className="TYPO-BODY-S FONT-MONO text-grayCRE-400">Block height</div>
      <Polling className="FONT-MONO !font-bold" label={`on-chain ${onchainBlockHeight}`} status={blockPollingStatus} />
      <Polling className="FONT-MONO !font-bold" label={`back-end ${backendBlockHeight}`} status={blockPollingStatus} />
    </div>
  )
}
