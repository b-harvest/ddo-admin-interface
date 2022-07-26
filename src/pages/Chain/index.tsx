import BigNumber from 'bignumber.js'
import AppPage from 'components/AppPage'
import Card from 'components/Card'
import Icon from 'components/Icon'
import Tag from 'components/Tag'
import Updater from 'components/Updater'
import useChain from 'hooks/useChain'
import { useMemo } from 'react'
import { AlertStatus } from 'types/alert'
import { openExplorerByHeight } from 'utils/browser'

import BlockChart from './sections/BlockChart'
import CreAlertTimeline from './sections/CreAlertTimeline'
import IBCVolume from './sections/IBCVolume'

export default function Chain() {
  const { blockCreationTime, onchainBlockHeight } = useChain()

  const blockCreationTimeUpdaterLabel = useMemo(
    () => `${new BigNumber(blockCreationTime).toFormat(0)}ms`,
    [blockCreationTime]
  )

  const blockCreationTimeStatus: { label: string; status: AlertStatus } = useMemo(() => {
    if (blockCreationTime <= 6000) return { label: 'Good', status: 'success' }
    else if (blockCreationTime <= 15000) return { label: 'Slow', status: 'warning' }
    else return { label: 'Delayed', status: 'error' }
  }, [blockCreationTime])

  return (
    <AppPage>
      <section className="text-black dark:text-white text-left mb-4">
        <Card useGlassEffect={true} className="!flex-row items-center space-x-2">
          <Updater
            labelPrefix={<BlockTimeUpdaterPrefix />}
            label={blockCreationTimeUpdaterLabel}
            status="neutral"
            onClick={() => openExplorerByHeight(onchainBlockHeight)}
          />
          <Tag status={blockCreationTimeStatus.status}>{blockCreationTimeStatus.label}</Tag>
        </Card>
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

function BlockTimeUpdaterPrefix() {
  return (
    <div className="flex items-center space-x-1">
      <Icon type="blockchain" />
      <span>Block created in </span>
    </div>
  )
}
