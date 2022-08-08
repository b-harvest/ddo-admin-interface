import AppPage from 'components/AppPage'

import useBlockChartData from './hooks/useBlockChartData'
import BlockEventChart from './sections/BlockEventChart'
import BlockLatencyChart from './sections/BlockLatencyChart'
import IBCNetwork from './sections/IBCNetwork'

export default function Chain() {
  const { eventIndicators, blockEventChartData, blockFlushChartData, blockEventDataLoading, blocksFlushDataLoading } =
    useBlockChartData()

  return (
    <AppPage>
      <section className=" mb-4">
        <IBCNetwork />
      </section>

      <section className="flex flex-col justify-between items-stretch space-y-4 mb-20">
        <BlockEventChart
          chartData={blockEventChartData}
          eventIndicators={eventIndicators}
          isLoading={blockEventDataLoading}
        />
        <BlockLatencyChart chartData={blockFlushChartData} isLoading={blocksFlushDataLoading} />
      </section>

      {/* <section className="flex flex-col md:flex-row items-stretch space-y-4 md:space-y-0 md:space-x-8 mb-20">
        <div className="shrink-0 grow-0 md:basis-[40%]"><IBCVolume /></div>
        <div className="shrink grow md:basis-[60%]"><CreAlertTimeline /></div>
      </section> */}
    </AppPage>
  )
}
