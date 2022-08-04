import AppPage from 'components/AppPage'
// import useChain from 'hooks/useChain'
// import useValidators from 'hooks/useValidators'
// import { useEffect, useState } from 'react'
import useLSV from 'hooks/useLSV'

import LSVList from './sections/LSVList'
import VotingTable from './sections/VotingTable'
// import ValidatorsSet from './sections/ValidatorsSet'

export default function LSVs() {
  // lsv monitoring

  // validators set
  // const { onchainBlockHeight } = useChain()
  // const [height, setHeight] = useState<string | undefined>()
  // useEffect(() => setHeight(onchainBlockHeight), [onchainBlockHeight])
  // const { validatorsetsLCD } = useValidators(height)

  const { allLSVTimestamp, allLSV } = useLSV()

  return (
    <AppPage>
      <section className="mb-20">
        <LSVList timestamp={allLSVTimestamp} list={allLSV} />
      </section>

      <section>
        <VotingTable timestamp={allLSVTimestamp} list={allLSV} />
      </section>

      {/* <section>{validatorsetsLCD ? <ValidatorsSet validatorsSet={validatorsetsLCD} /> : null}</section> */}
    </AppPage>
  )
}
