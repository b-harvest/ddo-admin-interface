import BigNumber from 'bignumber.js'
import Card from 'components/Card'
import FoldableSection from 'components/FordableSection'
import Tag from 'components/Tag'
import Updater from 'components/Updater'
import { CRESCENT_ASSET_IMG_URL } from 'constants/resources'
import useChain from 'hooks/useChain'
import useChainRegistry from 'hooks/useChainRegistry'
import { useMemo } from 'react'
import { AlertStatus } from 'types/alert'
import { openExplorerByHeight } from 'utils/browser'
import { COSMOS_CHAIN_NAME, openExplorerByChain } from 'utils/chainRegistry'

export default function IBCNetwork() {
  // crescent chain
  const { blockCreationTime, onchainBlockHeight } = useChain()
  const blockTimeStatus = useMemo(() => getBlockTimeStatus(blockCreationTime), [blockCreationTime])
  const blockTimeUpdaterLabel = useMemo(
    () => getBlockTimeUpdaterLabel({ blockCreationTime, blockTimeStatus }),
    [blockCreationTime, blockTimeStatus]
  )

  // cosmoshub chains
  const { blockCreationTime: axelarBlockTime, logoURI: axelarLogoURI } = useChainRegistry(COSMOS_CHAIN_NAME.axelar)
  const { blockCreationTime: gbridgeBlockTime, logoURI: gbridgeLogoURI } = useChainRegistry(COSMOS_CHAIN_NAME.gbridge)
  const { blockCreationTime: osmosisBlockTime, logoURI: osmosisLogoURI } = useChainRegistry(COSMOS_CHAIN_NAME.osmosis)
  const { blockCreationTime: evmosBlockTime, logoURI: evmosLogoURI } = useChainRegistry(COSMOS_CHAIN_NAME.evmos)

  const axelar = useMemo(
    () => ({
      blockTimeLabel: getBlockTimeUpdaterLabel({
        blockCreationTime: axelarBlockTime,
        blockTimeStatus: getBlockTimeStatus(axelarBlockTime),
      }),
      logoUrl: axelarLogoURI,
    }),
    [axelarBlockTime, axelarLogoURI]
  )

  const gbridge = useMemo(
    () => ({
      blockTimeLabel: getBlockTimeUpdaterLabel({
        blockCreationTime: gbridgeBlockTime,
        blockTimeStatus: getBlockTimeStatus(gbridgeBlockTime),
      }),
      logoUrl: gbridgeLogoURI,
    }),
    [gbridgeBlockTime, gbridgeLogoURI]
  )

  const osmosis = useMemo(
    () => ({
      blockTimeLabel: getBlockTimeUpdaterLabel({
        blockCreationTime: osmosisBlockTime,
        blockTimeStatus: getBlockTimeStatus(osmosisBlockTime),
      }),
      logoUrl: osmosisLogoURI,
    }),
    [osmosisBlockTime, osmosisLogoURI]
  )

  const evmos = useMemo(
    () => ({
      blockTimeLabel: getBlockTimeUpdaterLabel({
        blockCreationTime: evmosBlockTime,
        blockTimeStatus: getBlockTimeStatus(evmosBlockTime),
      }),
      logoUrl: evmosLogoURI,
    }),
    [evmosBlockTime, evmosLogoURI]
  )

  return (
    <Card useGlassEffect={true} className="text-black dark:text-white text-left">
      {/* crescent */}
      <div className="absolute top-4 left-4 flex justify-between items-center space-x-2">
        <Updater
          labelPrefix={<BlockTimeUpdaterPrefix logoUrl={CRESCENT_ASSET_IMG_URL} label="Block created in  " />}
          label={blockTimeUpdaterLabel}
          status="neutral"
          onClick={() => openExplorerByHeight(onchainBlockHeight)}
        />
      </div>

      {/* cosmoshub chains */}
      <FoldableSection defaultIsOpen={false}>
        <div className="space-y-4 pt-4 border-t border-grayCRE200 dark:border-grayCRE-400">
          <Updater
            labelPrefix={<BlockTimeUpdaterPrefix logoUrl={axelar.logoUrl} label={`Axelar  `} />}
            label={axelar.blockTimeLabel}
            status="neutral"
            onClick={() => openExplorerByChain(COSMOS_CHAIN_NAME.axelar)}
          />
          <Updater
            labelPrefix={<BlockTimeUpdaterPrefix logoUrl={gbridge.logoUrl} label={`Gravity Bridge  `} />}
            label={gbridge.blockTimeLabel}
            status="neutral"
            onClick={() => openExplorerByChain(COSMOS_CHAIN_NAME.gbridge)}
          />
          <Updater
            labelPrefix={<BlockTimeUpdaterPrefix logoUrl={osmosis.logoUrl} label={`Osmosis  `} />}
            label={osmosis.blockTimeLabel}
            status="neutral"
            onClick={() => openExplorerByChain(COSMOS_CHAIN_NAME.osmosis)}
          />
          <Updater
            labelPrefix={<BlockTimeUpdaterPrefix logoUrl={evmos.logoUrl} label={`Evmos  `} />}
            label={evmos.blockTimeLabel}
            status="neutral"
            onClick={() => openExplorerByChain(COSMOS_CHAIN_NAME.evmos)}
          />
        </div>
      </FoldableSection>
    </Card>
  )
}

function getBlockTimeLabel(time: number) {
  return time ? `${new BigNumber(time).toFormat(0)}ms` : '-'
}

function getBlockTimeStatus(time: number): { label: string; status: AlertStatus } {
  if (time === 0) return { label: 'Unknown', status: 'neutral' }
  else if (time <= 6000) return { label: 'Good', status: 'success' }
  else if (time <= 15000) return { label: 'Slow', status: 'warning' }
  else return { label: 'Delayed', status: 'error' }
}

function getBlockTimeUpdaterLabel({
  blockCreationTime,
  blockTimeStatus,
}: {
  blockCreationTime: number
  blockTimeStatus: { label: string; status: AlertStatus }
}) {
  return (
    <div className="flex items-center space-x-2">
      <div>{getBlockTimeLabel(blockCreationTime)}</div>
      <Tag status={blockTimeStatus.status}>{blockTimeStatus.label}</Tag>
    </div>
  )
}

function BlockTimeUpdaterPrefix({ logoUrl, label }: { logoUrl?: string; label: string }) {
  return (
    <div className="flex items-center space-x-1">
      {logoUrl && (
        <div className="flex justify-center items-center w-6 h-6">
          <img src={logoUrl} alt="" className="w-full object-contain" />
        </div>
      )}
      <span>{label}</span>
    </div>
  )
}
