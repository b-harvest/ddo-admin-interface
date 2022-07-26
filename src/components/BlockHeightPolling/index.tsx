import Polling from 'components/Polling'
import { useMemo } from 'react'
import { openExplorerByHeight } from 'utils/browser'

export default function BlockHeightPolling({
  onchainBlockHeight,
  backendBlockHeight,
}: {
  onchainBlockHeight: string
  backendBlockHeight: string
}) {
  const blockPollingStatus = useMemo(() => {
    if (onchainBlockHeight === '-' && onchainBlockHeight === backendBlockHeight) return 'neutral'

    const diff = Number(onchainBlockHeight) - Number(backendBlockHeight)
    return diff < 2 ? 'info' : diff < 4 ? 'warning' : 'error'
  }, [onchainBlockHeight, backendBlockHeight])

  return (
    <div className="shrink-0 grow-0 flex justify-start items-center space-x-4 FONT-MONO !font-medium">
      <Polling
        className=""
        label={`on-chain ${onchainBlockHeight}`}
        status={blockPollingStatus}
        onClick={() => openExplorerByHeight(onchainBlockHeight)}
      />
      <Polling
        className=""
        label={`back-end ${backendBlockHeight}`}
        status={blockPollingStatus}
        onClick={() => openExplorerByHeight(backendBlockHeight)}
      />
    </div>
  )
}
