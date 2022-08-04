import AppPage from 'components/AppPage'
import useChain from 'hooks/useChain'
import useValidators from 'hooks/useValidators'
import { useEffect, useState } from 'react'

import LSVList from './sections/LSVList'
import ValidatorsSet from './sections/ValidatorsSet'

export default function LSVs() {
  // lsv monitoring

  // validators set
  const { onchainBlockHeight } = useChain()
  const [height, setHeight] = useState<string | undefined>()
  useEffect(() => setHeight(onchainBlockHeight), [onchainBlockHeight])
  const { validatorsetsLCD } = useValidators(height)

  return (
    <AppPage>
      <section className="mb-20">
        <LSVList />
      </section>

      <section>{validatorsetsLCD ? <ValidatorsSet validatorsSet={validatorsetsLCD} /> : null}</section>
    </AppPage>
  )
}
