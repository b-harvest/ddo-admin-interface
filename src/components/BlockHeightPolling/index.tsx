import Polling from 'components/Polling'
import { useMemo } from 'react'

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

  const openMintscanByHeight = (height: string) => {
    window.open(`https://www.mintscan.io/crescent/blocks/${height}`, '_blank')
  }

  return (
    <div className="shrink-0 grow-0 flex justify-start items-center space-x-4 FONT-MONO !font-medium">
      <Polling
        className=""
        label={`on-chain ${onchainBlockHeight}`}
        status={blockPollingStatus}
        onClick={() => openMintscanByHeight(onchainBlockHeight)}
      />
      <Polling
        className=""
        label={`back-end ${backendBlockHeight}`}
        status={blockPollingStatus}
        onClick={() => openMintscanByHeight(backendBlockHeight)}
      />
    </div>
  )
}
